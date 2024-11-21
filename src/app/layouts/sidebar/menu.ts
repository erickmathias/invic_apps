import { MenuItem } from './menu.model';
import {UserProfile} from "../../shared/models/user-profile";

/*export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'Home',
    icon: 'bx-home-circle',
    link: '/',
  },
  {
    id: 10,
    label: 'Services',
    icon: 'bx-calendar',
    //link: '/',
    subItems: [
      {
        id: 3,
        label: 'BBS',
        link: 'bbs',
        parentId: 2
      },
    ]
  },

];*/

export class MainMenu{

  currentUser: UserProfile = JSON.parse(sessionStorage.getItem('user'))
  role = this.currentUser.role;

  static getMenu():MenuItem[] {
    const menu: MenuItem[] = [];
    menu.push(this.titleMenu())
    menu.push(this.homeMenu())
    menu.push(this.profileMenu())
    menu.push(this.clientsMenu())
    menu.push(this.packageMenu())
    menu.push(this.subscriptionMenu())
    menu.push(this.usersMenu())
    menu.push(this.serviceMenu())
    return menu;
  }

  static titleMenu(): MenuItem {
    const menu: MenuItem = {
      id: 1,
      label: 'MENUITEMS.MENU.TEXT',
      isTitle: true
    };
    return menu;
  }

  static homeMenu(): MenuItem {
    const menu: MenuItem = {
      id: 2,
      label: 'Home',
      icon: 'bx-home-circle',
      link: '/',
    };
    return menu;
  }

  static serviceMenu(): MenuItem {
    const menu: MenuItem = {
      id: 3,
      label: 'Services',
      icon: 'bx-calendar',
      //link: '/',
      subItems: [
      ]
    };

    const submenu = [
      { id: 1, label: 'BBS', link: 'bbs', parentId: 3 },
      { id: 2, label: 'SLUB', link: 'slab', parentId: 3 },
    ];
    menu.subItems.push(submenu[0]);
    menu.subItems.push(submenu[1]);

    return menu;
  }

  static packageMenu(): MenuItem {
    const menu: MenuItem = {
      id: 4,
      label: 'Packages',
      icon: 'bx bxs-package',
      link: '/packages',
    };
    return menu;
  }

  static clientsMenu(): MenuItem {
    const menu: MenuItem = {
      id: 5,
      label: 'Clients',
      icon: 'bx bxs-contact',
      link: '/clients',
    };
    return menu;
  }

  static subscriptionMenu(): MenuItem {
    const menu: MenuItem = {
      id: 5,
      label: 'Subscriptions',
      icon: 'bx bxs-coupon',
      link: '/subscriptions',
    };
    return menu;
  }

  static profileMenu(): MenuItem {
    const menu: MenuItem = {
      id: 5,
      label: 'Proflie',
      icon: 'bxs-user-detail',
      link: '/profile',
    };
    return menu;
  }

  static usersMenu(): MenuItem {
    const menu: MenuItem = {
      id: 6,
      label: 'Users',
      icon: 'bx-user',
      //link: '/',
      subItems: [
      ]
    };



    const submenu = [
      { id: 1, label: 'Accounts', link: 'users', parentId: 6 },
      // { id: 2, label: 'Profiles', link: 'users/profiles', parentId: 6 },
    ];
    menu.subItems.push(submenu[0]);
    // menu.subItems.push(submenu[1]);

    return menu;
  }


}
