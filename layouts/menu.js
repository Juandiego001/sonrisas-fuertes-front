export default [
  {
    icon: 'mdi-view-dashboard',
    title: 'Administración',
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Grupos',
        to: '/administration/groups'
      },
      {
        icon: 'mdi-wallet-membership',
        title: 'Clases',
        to: '/administration/subjects'
      },
      {
        icon: 'mdi-shield-account-variant-outline',
        title: 'Perfiles',
        to: '/administration/profiles'
      },
      {
        icon: 'mdi-chart-timeline-variant',
        title: 'Periodos académicos',
        to: '/administration/academic-periods'
      },
      {
        icon: 'mdi-chart-box-outline',
        title: 'Reportes',
        to: '/administration/reports'
      }
    ]
  },
  {
    icon: 'mdi-account',
    title: 'Usuarios',
    items: [
      {
        icon: 'mdi-shield-crown-outline',
        title: 'Administradores',
        to: '/users/admins'
      },
      {
        icon: 'mdi-account-circle-outline',
        title: 'Profesores',
        to: '/users/teachers'
      },
      {
        icon: 'mdi-school',
        title: 'Estudiantes',
        to: '/users/students'
      }
    ]
  }
]
