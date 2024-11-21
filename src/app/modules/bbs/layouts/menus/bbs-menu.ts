import {MenuItem} from "../../../../layouts/sidebar/menu.model";
import {UserProfile} from "../../../../shared/models/user-profile";

export class BbsMenu{

  currentUser: UserProfile = JSON.parse(sessionStorage.getItem('user'))
  role = this.currentUser.role;

  static getMenu():MenuItem[] {
    const menu: MenuItem[] = [];
    menu.push(this.homeMenu())
    //menu.push(this.profileMenu())
    //menu.push(this.clientMenu())
    menu.push(this.projectMenu())
    //menu.push(this.packageMenu())
    //menu.push(this.subscriptionMenu())

    /*menu.push(
      {
        id: 1,
        label: 'Home',
        icon: 'bx-home-circle',
        link: '/',
      },
      {
        id: 2,
        label: 'Profile',
        icon: 'bxs-user-detail',
        link: '/bbs/profile',
      },
      {
        id: 3,
        label: 'Clients',
        icon: 'bx bxs-contact',
        link: '/bbs/clients',
      },
      {
        id: 4,
        label: 'Projects',
        icon: 'bx-food-menu',
        link: '/bbs/projects',
      },
      {
        id: 5,
        label: 'Packages',
        icon: 'bx bxs-package',
        link: '/bbs/packages',
      },
      {
        id: 6,
        label: 'Subscriptions',
        icon: 'bx bxs-coupon',
        link: '/bbs/subscriptions',
      },
    )*/

    return menu;
  }

  static homeMenu(): MenuItem {
    const menu: MenuItem = {
      id: 1,
      label: 'Home',
      icon: 'bx-home-circle',
      link: '/',
    };

/*    const submenu = [
      { icon: 'i-CMYK', name: 'Home', state: 'disbursement/home', type: 'link' },
      { icon: 'i-Clock-3', name: 'Version 1', state: '/dashboard/v1', type: 'link' },
      { icon: 'i-Clock-4', name: 'Version 2', state: '/dashboard/v2', type: 'link' },
      { icon: 'i-Over-Time', name: 'Version 3', state: '/dashboard/v3', type: 'link' },
      { icon: 'i-Clock', name: 'Version 4', state: '/dashboard/v4', type: 'link' }
    ];
    menu.sub.push(submenu[0]);*/
    return menu;
  }

  static profileMenu(): MenuItem {
    const menu: MenuItem = {
      id: 2,
      label: 'Profile',
      icon: 'bxs-user-detail',
      link: '/bbs/profile',
    };
    return menu;
  }

  static clientMenu(): MenuItem {
    const menu: MenuItem = {
      id: 3,
      label: 'Clients',
      icon: 'bx bxs-contact',
      link: '/bbs/clients',
    };
    return menu;
  }

  static projectMenu(): MenuItem {
    const menu: MenuItem = {
      id: 4,
      label: 'Projects',
      icon: 'bx-food-menu',
      link: '/bbs/projects',
    };
    return menu;
  }

  static packageMenu(): MenuItem {
    const menu: MenuItem = {
      id: 5,
      label: 'Packages',
      icon: 'bx bxs-package',
      link: '/bbs/packages',
    };
    return menu;
  }

  static subscriptionMenu(): MenuItem {
    const menu: MenuItem = {
      id: 6,
      label: 'Subscriptions',
      icon: 'bx bxs-coupon',
      link: '/bbs/subscriptions',
    };
    return menu;
  }
}
