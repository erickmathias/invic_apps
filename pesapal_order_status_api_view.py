from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction

class PesapalOrderStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Extract and validate request data
            order_tracking_id = request.data.get('OrderTrackingId')
            
            if not order_tracking_id:
                return Response(
                    {"message": "OrderTrackingId is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get package subscription with error handling
            package_subscription = get_object_or_404(
                PackageSubscription, 
                gtw_order_tracking_id=order_tracking_id
            )
            
            # Check order status from external service
            response = self._check_order_status(order_tracking_id)
            
            # Prepare payment data
            payment_data = self._prepare_payment_data(package_subscription, response)
            
            # Check if payment already exists
            existing_payment = SubscriptionPaymentStatus.objects.filter(
                order_tracking_id=order_tracking_id
            ).first()
            
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
                self._update_package_subscription(package_subscription, response)
                
                # Return success response
                package_subscription_serializer = PackageSubscriptionListSerializer(package_subscription)
                return Response(
                    package_subscription_serializer.data, 
                    status=status.HTTP_200_OK
                )
                
        except PackageSubscription.DoesNotExist:
            return Response(
                {"message": "Invalid Subscription"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # Log the error for debugging
            print(f"PesapalOrderStatusAPIView error: {str(e)}")
            return Response(
                {"message": "An unexpected error occurred"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _check_order_status(self, order_tracking_id):
        """Check order status from external service"""
        try:
            response = check_order_check_status(orderTrackingId=order_tracking_id)
            print("Order Status Response:", response)
            return response
        except Exception as e:
            print(f"Error checking order status: {str(e)}")
            raise Exception(f"Failed to check order status: {str(e)}")
    
    def _prepare_payment_data(self, package_subscription, response):
        """Prepare payment data dictionary from response"""
        return {
            "package_subscription": package_subscription.pk,
            "payment_method": response.get('payment_method'),
            "amount": response.get('amount'),
            "created_date": response.get('created_date'),
            "confirmation_code": response.get('confirmation_code'),
            "order_tracking_id": response.get('order_tracking_id'),
            "description": response.get('description'),
            "message": response.get('message'),
            "payment_account": response.get('payment_account'),
            "call_back_url": response.get('call_back_url'),
            "status_code": response.get('status_code'),
            "merchant_reference": response.get('merchant_reference'),
            "account_number": response.get('account_number'),
            "payment_status_code": response.get('payment_status_code'),
            "currency": response.get('currency'),
            "status": response.get('status'),
            "error_type": response.get('error', {}).get('error_type'),
            "error_code": response.get('error', {}).get('code'),
            "error_message": response.get('error', {}).get('message'),
        }
    
    def _update_package_subscription(self, package_subscription, response):
        """Update package subscription with payment response data"""
        package_subscription.total_amount_paid = response.get('amount')
        package_subscription.paid_status = 1
        package_subscription.status = 1
        package_subscription.paid_date = response.get('created_date')
        package_subscription.payment_status = response.get('status_code')
        package_subscription.save() 