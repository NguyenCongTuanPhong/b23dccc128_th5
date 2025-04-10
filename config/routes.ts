export default [
  {
    path: '/',
    component: '@/layouts',
    routes: [
      {
        path: '/',
        name: 'Trang chủ',
        component: './TrangChu',
        icon: 'HomeOutlined',
      },
      {
        path: '/random-user',
        name: 'RandomUser',
        component: './RandomUser',
        icon: 'ArrowsAltOutlined',
      },
      {
        path: '/club-management',
        name: 'Quản lý CLB',
        icon: 'TeamOutlined',
        routes: [
          {
            path: '/club-management',
            component: './ClubManagement/index',
            name: 'Danh sách CLB',
          },
          {
            path: '/club-management/members/:clubId',
            component: './ClubManagement/members',
            name: 'Thành viên CLB',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/member-registration',
        name: 'Quản lý đơn đăng ký',
        icon: 'FormOutlined',
        component: './MemberRegistration',
      },
      {
        path: '/course-management',
        name: 'Quản lý khóa học',
        icon: 'book',
        component: './CourseManagement',
      },
      {
        path: '/instructor-management',
        name: 'Quản lý giảng viên',
        icon: 'team',
        component: './InstructorManagement',
      },
      {
        path: '/notification',
        routes: [
          {
            path: './subscribe',
            exact: true,
            component: './ThongBao/Subscribe',
          },
          {
            path: './check',
            exact: true,
            component: './ThongBao/Check',
          },
          {
            path: './',
            exact: true,
            component: './ThongBao/NotifOneSignal',
          },
        ],
        layout: false,
        hideInMenu: true,
      },
      {
        path: '/user',
        layout: false,
        routes: [
          {
            path: '/user/login',
            layout: false,
            name: 'login',
            component: './user/Login',
          },
          {
            path: '/user',
            redirect: '/user/login',
          },
        ],
      },
      {
        path: '/403',
        component: './exception/403/403Page',
        layout: false,
      },
      {
        path: '/hold-on',
        component: './exception/DangCapNhat',
        layout: false,
      },
    ],
  },
];