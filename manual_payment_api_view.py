from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db import transaction

class ManualPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Check if testing environment is enabled
        if not TESTING_ENV:
            return Response(
                {"message": "Invalid Operation, this is valid for testing only"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Extract and validate request data
            subscription_id = request.data.get('subscription_id')
            receipt_number = request.data.get('receipt_number')
            
            if not subscription_id or not receipt_number:
                return Response(
                    {"message": "subscription_id and receipt_number are required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get package subscription with error handling
            package_subscription = get_object_or_404(PackageSubscription, pk=subscription_id)
            
            # Check if payment already exists
            existing_payment = SubscriptionPaymentStatus.objects.filter(
                order_tracking_id=receipt_number
            ).first()
            
            # Prepare payment data
            payment_data = self._prepare_payment_data(package_subscription, receipt_number)
            
            # Process payment with database transaction
            with transaction.atomic():
                if existing_payment:
                    # Update existing payment
                    subscription_payment_status_serializer = SubscriptionPaymentStatusSerializer(
                        existing_payment, 
                        data=payment_data
                    )
                else:
                    # Create new payment
                    subscription_payment_status_serializer = SubscriptionPaymentStatusSerializer(
                        data=payment_data
                    )
                
                if not subscription_payment_status_serializer.is_valid():
                    return Response(
                        {
                            "message": "Payment data validation failed", 
                            "errors": subscription_payment_status_serializer.errors
                        }, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Save payment status
                subscription_payment_status_serializer.save()
                
                # Update package subscription
                self._update_package_subscription(package_subscription)
                
                # Return success response
                package_subscription_serializer = PackageSubscriptionListSerializer(package_subscription)
                return Response(
                    package_subscription_serializer.data, 
                    status=status.HTTP_200_OK
                )
                
        except PackageSubscription.DoesNotExist:
            return Response(
                {"message": "Package subscription not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Log the error for debugging
            print(f"ManualPaymentAPIView error: {str(e)}")
            return Response(
                {"message": "An unexpected error occurred"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _prepare_payment_data(self, package_subscription, receipt_number):
        """Prepare payment data dictionary"""
        return {
            "package_subscription": package_subscription.pk,
            "payment_method": "FAKE",
            "amount": package_subscription.total_amount_billed,
            "created_date": timezone.now(),
            "confirmation_code": receipt_number,
            "order_tracking_id": receipt_number,
            "description": "Transaction successfully processed Manual Payment",
            "message": "Transaction successfully processed Manual Payment",
            "payment_account": None,
            "call_back_url": None,
            "status_code": 1,
            "merchant_reference": package_subscription.pk,
            "account_number": None,
            "payment_status_code": None,
            "currency": "TZS",
            "status": 200,
            "error_type": None,
            "error_code": None,
            "error_message": None,
        }
    
    def _update_package_subscription(self, package_subscription):
        """Update package subscription payment status"""
        package_subscription.total_amount_paid = package_subscription.total_amount_billed
        package_subscription.paid_status = 1
        package_subscription.status = 1
        package_subscription.paid_date = timezone.now()
        package_subscription.payment_status = 1
        package_subscription.save() 