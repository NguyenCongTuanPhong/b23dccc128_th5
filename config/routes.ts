export default [
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

  ///////////////////////////////////
  // DEFAULT MENU
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: './TrangChu',
    icon: 'HomeOutlined',
  },
  {
    path: '/gioi-thieu',
    name: 'About',
    component: './TienIch/GioiThieu',
    hideInMenu: true,
  },
  {
    path: '/random-user',
    name: 'RandomUser',
    component: './RandomUser',
    icon: 'ArrowsAltOutlined',
  },


  // DANH MUC HE THONG
  // {
  // 	name: 'DanhMuc',
  // 	path: '/danh-muc',
  // 	icon: 'copy',
  // 	routes: [
  // 		{
  // 			name: 'ChucVu',
  // 			path: 'chuc-vu',
  // 			component: './DanhMuc/ChucVu',
  // 		},
  // 	],
  // },

  // Quản lý tổng hợp
  /*{
    name: 'Quản lý',
    path: '/management',
    icon: 'AppstoreOutlined',
    routes: [
      {
        name: 'Nhân viên & Dịch vụ',
        path: '/management/employees',
        component: './Management/Employees',
        icon: 'UserOutlined',
      },
      {
        name: 'Lịch làm việc',
        path: '/management/schedules',
        component: './Booking App/components/AppointmentManagement',
        icon: 'ScheduleOutlined',
      },
      {
        name: 'Lịch hẹn',
        path: '/management/appointments',
        icon: 'CalendarOutlined',
        routes: [
          {
            name: 'Đặt lịch hẹn',
            path: '/management/appointments/booking',
            component: './Booking App/components/AppointmentManagement',
            icon: 'PlusCircleOutlined',
          },
          
        ],
      },
      {
        name: 'Đánh giá',
        path: '/management/ratings',
        component: './Booking App/components/ReviewSection',
        icon: 'StarOutlined',
      },
      {
        name: 'Thống kê',
        path: '/management/statistics',
        component: './Booking App/components/Statistics',
        icon: 'BarChartOutlined',
      }
    ],
  },*/

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
    path: '/',
    redirect: '/dashboard',
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
  {
    path: '/course-management',
    name: 'course-management',
    icon: 'book',
    component: './CourseManagement',
  },
  {
    path: '/instructor-management',
    name: 'instructor-management',
    icon: 'team',
    component: './InstructorManagement',
  },
  {
    component: './404',
  }
];
