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
                url      : '/admin/vehicles/vehicles',
            },
            {
                id       : 'operators',
                title    : 'Operators',
                translate: 'NAV.OPERATORS',
                type     : 'item',
                url      : '/admin/operators/operators'
            },
            {
                id       : 'routes',
                title    : 'Routes',
                translate: 'NAV.ROUTES',
                type     : 'item',
                url      : '/admin/routes/routes'
            },
            {
                id       : 'users',
                title    : 'Users',
                translate: 'NAV.USERS',
                type     : 'item',
                url      : '/admin/users/users'
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
                url      : '/admin/makes/makes'
            },
            {
                id       : 'models',
                title    : 'Models',
                translate: 'NAV.MODELS',
                type     : 'item',
                url      : '/admin/models/models'
            },
            {
                id       : 'icons',
                title    : 'Icons',
                translate: 'NAV.ICONS',
                type     : 'item',
                url      : 'pages/admin/icons'
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
                        url      : '/admin/poi/pois/pois'
                    },
                    {
                        id       : 'poigroups',
                        title    : 'Groups',
                        translate: 'NAV.GROUPS',
                        type     : 'item',
                        url      : '/admin/poi/poigroups/poigroups'
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
                        url      : '/admin/geofences/zones/zones'
                    },
                    {
                        id       : 'geofences_groups',
                        title    : 'Groups',
                        translate: 'NAV.GROUPS',
                        type     : 'item',
                        url      : '/admin/geofences/zonegroups/zonegroups'
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
                id       : 'companies',
                title    : 'Companies',
                translate: 'NAV.COMPANIES',
                type     : 'item',
                url      : '/admin/companies/companies'
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
                url      : '/admin/groups/groups'
            },
            {
                id       : 'insurancecompanies',
                title    : 'Insurance Companies',
                translate: 'NAV.INSURANCECOMPANIES',
                type     : 'item',
                url      : '/admin/insurancecompanies/insurancecompanies'
            },
            {
                id       : 'dealercompanies',
                title    : 'Dealers',
                translate: 'NAV.DEALERS',
                type     : 'item',
                url      : '/admin/dealercompanies/dealercompanies'
            },
            {
                id       : 'events',
                title    : 'Events',
                translate: 'NAV.EVENTS',
                type     : 'item',
                url      : '/admin/events/events'
            }
        ]
    },

    {
        id       : 'report',
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
                url      : '/report/reportcomponent/1_Administrative'
            },
            {
                id       : 'locationhistory',
                title    : 'Location History',
                translate: 'NAV.LOCATIONHISTORY',
                type     : 'item',
                url      : '/report/reportcomponent/2_LocationHistory'
            },
            {
                id       : 'reports_logistics',
                title    : 'Logistics',
                translate: 'NAV.LOGISTICS',
                type     : 'item',
                url      : '/report/reportcomponent/3_Logistics'
            },
            {
                id       : 'fuel',
                title    : 'Fuel',
                translate: 'NAV.FUEL',
                type     : 'item',
                url      : '/report/reportcomponent/4_Fuel'
            },
            {
                id       : 'events',
                title    : 'Events',
                translate: 'NAV.EVENTS',
                type     : 'item',
                url      : '/report/reportcomponent/5_Event'
            },
            {
                id       : 'driver_behavior',
                title    : 'Driver Behavior',
                translate: 'NAV.DRIVERBEHAVIOR',
                type     : 'item',
                url      : '/report/reportcomponent/6_DriverBehavior'
            },
            {
                id       : 'telemetry',
                title    : 'Telemetry',
                translate: 'NAV.TELEMETRY',
                type     : 'item',
                url      : '/report/reportcomponent/7_Telemetry'
            },
            {
                id       : 'system_admin',
                title    : 'System Admin',
                translate: 'NAV.SYSTEMADMIN',
                type     : 'item',
                url      : '/report/reportcomponent/8_SystemAdministration'
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
                type     : 'collapsable',
                children : [
                    {
                        id       : 'pendings',
                        title    : 'Dashboards',
                        translate: 'NAV.DASHBOARD',
                        type     : 'item',
                        url      : '/logistic/pendings/pendings'
                    },
                    {
                        id       : 'events',
                        title    : 'Events',
                        translate: 'NAV.EVENT',
                        type     : 'item',
                        url      : '/logistic/events/events'
                    },
                    {
                        id       : 'serviceitems',
                        title    : 'Service Items',
                        translate: 'NAV.SERVICEITEM',
                        type     : 'item',
                        url      : '/logistic/serviceitems/serviceitems'
                    },
                    {
                        id       : 'maintservices',
                        title    : 'Services',
                        translate: 'NAV.SERVICE',
                        type     : 'item',
                        url      : '/logistic/maintservices/maintservices'
                    },
                    {
                        id       : 'history',
                        title    : 'History',
                        translate: 'NAV.HISTORY',
                        type     : 'item',
                        url      : '/logistic/history/history'
                    },
                ]
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
                type     : 'collapsable',
                children: [
                    {
                        id       : 'board',
                        title    : 'Board',
                        translate: 'NAV.BOARD',
                        type     : 'item',
                        url      : '/logistic/scrumboard'
                    },
                    {
                        id       : 'list',
                        title    : 'List',
                        translate: 'NAV.LIST',
                        type     : 'item',
                        url      : '/logistic/todo'
                    },
                ]
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
                url      : 'fuelmanagement/tanks/tanks'
            },
            {
                id       : 'fuel_registry',
                title    : 'Fueling Registry',
                translate: 'NAV.FUELINGREGISTRY',
                type     : 'item',
                url      : 'fuelmanagement/fuelregistries/fuelregistries'
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

    {
        id       : 'system',
        title    : 'System',
        translate: 'NAV.SYSTEM',
        type     : 'collapsable',
        icon     : 'personal_video',
        children : [
            {
                id       : 'privileges',
                title    : 'Privileges',
                translate: 'NAV.PRIVILEGES',
                type     : 'item',
                url      : '/system/privileges/privileges'
            },
            {
                id       : 'userprofiles',
                title    : 'User Roles',
                translate: 'NAV.USER_ROLES',
                type     : 'item',
                url      : '/system/userprofiles/userprofiles'
            },
            {
                id       : 'unittypes',
                title    : 'Unit Types',
                translate: 'NAV.UNITTYPES',
                type     : 'item',
                url      : '/system/unittypes/unittypes'
            },

            {
                id       : 'devices',
                title    : 'Devices',
                translate: 'NAV.DEVICES',
                type     : 'item',
                url      : '/system/devices/devices'
            },

            {
                id       : 'simcards',
                title    : 'SIMs',
                translate: 'NAV.SIMS',
                type     : 'item',
                url      : '/system/simcards/simcards'
            },
            
            {
                id       : 'carriers',
                title    : 'Carriers',
                translate: 'NAV.CARRIERS',
                type     : 'item',
                url      : '/system/carriers/carriers'
            },
            
            {
                id       : 'accounts',
                title    : 'Accounts',
                translate: 'NAV.ACCOUNTS',
                type     : 'item',
                url      : '/system/accounts/accounts'
            },
            
            {
                id       : 'system_configuration',
                title    : 'System Configuration',
                translate: 'NAV.SYSTEMCONFIGURATION',
                type     : 'item',
                url      : '/system/systemconfiguration/systemconfiguration'
            },
             
            {
                id       : 'serviceplans',
                title    : 'Service Plans',
                translate: 'NAV.SERVICEPLANS',
                type     : 'item',
                url      : '/system/serviceplans/serviceplans'
            },
            {
                id       : 'devconfigs',
                title    : 'System Commands',
                translate: 'NAV.DEV_CONFIG',
                type     : 'item',
                url      : 'system/devconfigs/devconfigs'
            },
            {
                id       : 'syscommands',
                title    : 'System Commands',
                translate: 'NAV.SYSTEM_COMMANDS',
                type     : 'item',
                url      : 'system/syscommands/syscommands'
            },
            {
                id       : 'commands',
                title    : 'Commands',
                translate: 'NAV.COMMANDS',
                type     : 'item',
                url      : '/system/commands/commands'
               
            },
            {
                id       : 'connections',
                title    : 'Connections',
                translate: 'NAV.CONNECTIONS',
                type     : 'item',
                url      : 'system/connections/connections'
            }
        ]
    },
];
