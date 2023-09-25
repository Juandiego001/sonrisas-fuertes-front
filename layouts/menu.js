const multipleOptions = [
  {
    icon: 'mdi-view-dashboard',
    title: 'Administración',
    items: [
      {
        icon: 'mdi-shield-account-variant-outline',
        title: 'Permisos',
        to: '/administration/permissions'
      },
      {
        icon: 'mdi-chart-timeline-variant',
        title: 'Periodos académicos',
        to: '/administration/academic-periods'
      },
      {
        icon: 'mdi-chart-box-outline',
        title: 'Informes',
        to: '/administration/reports'
      }
    ]
  },
  {
    icon: 'mdi-view-dashboard-outline',
    title: 'Grupos'
  }
]

const singleOptions = [
  {
    icon: 'mdi-account-circle-outline',
    title: 'Profesores',
    to: '/teachers'
  },
  {
    icon: 'mdi-school',
    title: 'Estudiantes',
    to: '/students'
  },
  {
    icon: 'mdi-wallet-membership',
    title: 'Clases',
    to: '/subjects'
  }
]

export default { multipleOptions, singleOptions }
