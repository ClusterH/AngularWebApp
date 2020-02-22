import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'home',
        title    : 'Home',
        translate: 'NAV.HOME',
        type     : 'collapsable',
        icon     : 'home',
        children : [
            {
                id       : 'dashboards',
                title    : 'Dashboards',
                translate: 'NAV.DASHBOARD',
                type     : 'item',
                url      : '/home/analytics'
            },
            {
                id       : 'google',
                title    : 'Google',
                translate: 'NAV.GOOGLE',
                type     : 'item',
                url      : '/home/google'
            },
            {
                id       : 'osm',
                title    : 'OSM',
                translate: 'NAV.OSM',
                type     : 'item',
                url      : '/home/osm'
            },
        ]
    },

    {
        id       : 'admin',
        title    : 'Admin',
        translate: 'NAV.ADMIN',
        type     : 'collapsable',
        icon     : 'lock',
        children : [
            {
                id       : 'vehicles',
                title    : 'Vehicles',
                translate: 'NAV.VEHICLES',
                type     : 'item',
                url      : '/admin/vehicles'
            },
            {
                id       : 'operators',
                title    : 'Operators',
                translate: 'NAV.OPERATORS',
                type     : 'item',
                url      : 'pages/admin/operators'
            },
            {
                id       : 'routes',
                title    : 'Routes',
                translate: 'NAV.ROUTES',
                type     : 'item',
                url      : 'pages/admin/routes'
            },
            {
                id       : 'users',
                title    : 'Users',
                translate: 'NAV.USERS',
                type     : 'item',
                url      : 'pages/admin/users'
            },
            {
                id       : 'users_profiles',
                title    : 'Users Profiles',
                translate: 'NAV.USERSPROFILES',
                type     : 'item',
                url      : 'pages/admin/users_profiles'
            },
            {
                id       : 'privileges',
                title    : 'Privileges',
                translate: 'NAV.PROVILEGES',
                type     : 'item',
                url      : 'pages/admin/privileges'
            },
            {
                id       : 'monitoring_groups',
                title    : 'Monitoring Groups',
                translate: 'NAV.MONITORINGGROUPS',
                type     : 'item',
                url      : 'pages/admin/monitoring_groups'
            },
            {
                id       : 'schedules',
                title    : 'Schedules',
                translate: 'NAV.SCHEDULES',
                type     : 'item',
                url      : 'pages/admin/schedules'
            },
            {
                id       : 'make',
                title    : 'Make',
                translate: 'NAV.MAKE',
                type     : 'item',
                url      : 'pages/admin/make'
            },
            {
                id       : 'models',
                title    : 'Models',
                translate: 'NAV.MODELS',
                type     : 'item',
                url      : 'pages/admin/models'
            },
            {
                id       : 'icons',
                title    : 'Icons',
                translate: 'NAV.ICONS',
                type     : 'item',
                url      : 'pages/admin/icons'
            },
            {
                id       : 'vehicle_types',
                title    : 'Vehicle Types',
                translate: 'NAV.VEHICLETYPES',
                type     : 'item',
                url      : 'pages/admin/vehicle_types'
            },
            {
                id       : 'shifts',
                title    : 'Shifts',
                translate: 'NAV.SHIFTS',
                type     : 'item',
                url      : 'pages/admin/shifts'
            },
            {
                id       : 'poi',
                title    : 'POI',
                translate: 'NAV.POI',
                type     : 'collapsable',
                children : [
                    {
                        id       : 'pois',
                        title    : 'POIs',
                        translate: 'NAV.POIS',
                        type     : 'item',
                        url      : 'pages/admin/poi/pois'
                    },
                    {
                        id       : 'poi_groups',
                        title    : 'Groups',
                        translate: 'NAV.GROUPS',
                        type     : 'item',
                        url      : 'pages/admin/poi/poi_groups'
                    },
                ]
            },
            {
                id       : 'geofences',
                title    : 'Geofences',
                translate: 'NAV.GEOFENCES',
                type     : 'collapsable',
                children : [
                    {
                        id       : 'zones',
                        title    : 'Zones',
                        translate: 'NAV.ZONES',
                        type     : 'item',
                        url      : 'pages/admin/geofences/zones'
                    },
                    {
                        id       : 'geofences_groups',
                        title    : 'Groups',
                        translate: 'NAV.GROUPS',
                        type     : 'item',
                        url      : 'pages/admin/geofences/groups'
                    },
                ]
            },
            {
                id       : 'cargos',
                title    : 'Cargos',
                translate: 'NAV.CARGOS',
                type     : 'item',
                url      : 'pages/admin/cargos'
            },
            {
                id       : 'persons',
                title    : 'Persons',
                translate: 'NAV.PERSONS',
                type     : 'item',
                url      : 'pages/admin/persons'
            },
            {
                id       : 'assets',
                title    : 'Assets',
                translate: 'NAV.ASSETS',
                type     : 'item',
                url      : 'pages/admin/assets'
            },
            {
                id       : 'devices',
                title    : 'Devices',
                translate: 'NAV.DEVICES',
                type     : 'item',
                url      : 'pages/admin/devices'
            },
            {
                id       : 'sims',
                title    : 'SIMs',
                translate: 'NAV.SIMS',
                type     : 'item',
                url      : 'pages/admin/sims'
            },
            {
                id       : 'carries',
                title    : 'Carries',
                translate: 'NAV.CARRIES',
                type     : 'item',
                url      : 'pages/admin/carries'
            },
            {
                id       : 'accounts',
                title    : 'Accounts',
                translate: 'NAV.ACCOUNTS',
                type     : 'item',
                url      : 'pages/admin/accounts'
            },
            {
                id       : 'system_configuration',
                title    : 'System Configuration',
                translate: 'NAV.SYSTEMCONFIGURATION',
                type     : 'item',
                url      : 'pages/admin/system_configuration'
            },
            {
                id       : 'service_plans',
                title    : 'Service Plans',
                translate: 'NAV.SERVICEPLANS',
                type     : 'item',
                url      : 'pages/admin/service_plans'
            },
            {
                id       : 'commands',
                title    : 'Commands',
                translate: 'NAV.COMMANDS',
                type     : 'item',
                url      : 'pages/admin/commands'
            },
            {
                id       : 'companies',
                title    : 'Companies',
                translate: 'NAV.COMPANIES',
                type     : 'item',
                url      : 'pages/admin/companies'
            },
            {
                id       : 'subfleets',
                title    : 'SubFleets',
                translate: 'NAV.SUBFLEETS',
                type     : 'item',
                url      : 'pages/admin/subfleets'
            },
            {
                id       : 'groups',
                title    : 'Groups',
                translate: 'NAV.GROUPS',
                type     : 'item',
                url      : 'pages/admin/groups'
            },
            {
                id       : 'insurance_companies',
                title    : 'Insurance Companies',
                translate: 'NAV.INSURANCECOMPANIES',
                type     : 'item',
                url      : 'pages/admin/insurance_companies'
            },
            {
                id       : 'dealers',
                title    : 'Dealers',
                translate: 'NAV.DEALERS',
                type     : 'item',
                url      : 'pages/admin/dealers'
            },
            {
                id       : 'events',
                title    : 'Events',
                translate: 'NAV.EVENTS',
                type     : 'item',
                url      : 'pages/admin/events'
            },
        ]
    },

    {
        id       : 'reports',
        title    : 'Reports',
        translate: 'NAV.REPORTS',
        type     : 'collapsable',
        icon     : 'receipt',
        children : [
            {
                id       : 'administrative',
                title    : 'Administrative',
                translate: 'NAV.ADMINISTRATIVE',
                type     : 'item',
                url      : 'pages/reports/administrative'
            },
            {
                id       : 'location_history',
                title    : 'Location History',
                translate: 'NAV.LOCATIONHISTORY',
                type     : 'item',
                url      : 'pages/reports/location_history'
            },
            {
                id       : 'reports_logistics',
                title    : 'Logistics',
                translate: 'NAV.LOGISTICS',
                type     : 'item',
                url      : 'pages/reports/reports_logistics'
            },
            {
                id       : 'fuel',
                title    : 'Fuel',
                translate: 'NAV.FUEL',
                type     : 'item',
                url      : 'pages/reports/fuel'
            },
            {
                id       : 'events',
                title    : 'Events',
                translate: 'NAV.EVENTS',
                type     : 'item',
                url      : 'pages/reports/events'
            },
            {
                id       : 'driver_behavior',
                title    : 'Driver Behavior',
                translate: 'NAV.DRIVERBEHAVIOR',
                type     : 'item',
                url      : 'pages/reports/driver_behavior'
            },
            {
                id       : 'system_admin',
                title    : 'System Admin',
                translate: 'NAV.SYSTEMADMIN',
                type     : 'item',
                url      : 'pages/reports/system_admin'
            },
            {
                id       : 'telemetry',
                title    : 'Telemetry',
                translate: 'NAV.TELEMETRY',
                type     : 'item',
                url      : 'pages/reports/telemetry'
            },
        ]
    },

    {
        id       : 'logistics',
        title    : 'Logistics',
        translate: 'NAV.LOGISTICS',
        type     : 'collapsable',
        icon     : 'dashboard',
        children : [
            {
                id       : 'maintenance',
                title    : 'Maintenance',
                translate: 'NAV.MAINTENANCE',
                type     : 'item',
                url      : 'pages/logistics/maintenance'
            },
            {
                id       : 'route_center',
                title    : 'Route Center',
                translate: 'NAV.ROUTECENTER',
                type     : 'item',
                url      : 'pages/logistics/route_center'
            },
            {
                id       : 'monitoring',
                title    : 'Monitoring',
                translate: 'NAV.MONITORING',
                type     : 'item',
                url      : 'pages/logistics/monitoring'
            },
            {
                id       : 'job_management',
                title    : 'Job Management',
                translate: 'NAV.JOBMANAGEMENT',
                type     : 'item',
                url      : 'pages/logistics/job_management'
            },
        ]
    },

    {
        id       : 'fule_management',
        title    : 'Fuel Management',
        translate: 'NAV.FUELMANAGEMENT',
        type     : 'collapsable',
        icon     : 'build',
        children : [
            {
                id       : 'tanks',
                title    : 'Tanks',
                translate: 'NAV.TANKS',
                type     : 'item',
                url      : 'pages/fuel_management/tanks'
            },
            {
                id       : 'fueling_registry',
                title    : 'Fueling Registry',
                translate: 'NAV.FUELINGREGISTRY',
                type     : 'item',
                url      : 'pages/fuel_management/fueling_registry'
            },
        ]
    },

    {
        id       : 'setting',
        title    : 'Setting',
        translate: 'NAV.SETTING',
        type     : 'collapsable',
        icon     : 'settings',
        children : [
            {
                id       : 'my_account',
                title    : 'My Account',
                translate: 'NAV.MYACCOUNT',
                type     : 'item',
                url      : 'pages/setting/my_account'
            },
            {
                id       : 'user_setting',
                title    : 'User Setting',
                translate: 'NAV.USERSETTING',
                type     : 'item',
                url      : 'pages/setting/user_setting'
            },
        ]
    },
];
