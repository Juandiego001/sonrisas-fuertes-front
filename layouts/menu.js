export default [
  {
    icon: 'mdi-view-dashboard',
    title: 'Administración',
    items: [
      {
        icon: 'mdi-shield-account-variant-outline',
        title: 'Perfiles',
        to: '/administration/profiles'
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
        icon: 'mdi-human-male-boy',
        title: 'Acudientes',
        to: '/users/tutors'
      },
      {
        icon: 'mdi-school',
        title: 'Estudiantes',
        to: '/users/students'
      }
    ]
  }
]
