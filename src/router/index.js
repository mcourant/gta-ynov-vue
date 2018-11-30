import Vue from 'vue'
import Router from 'vue-router'
import Login from './../components/LoginComponent'
import Register from './../components/RegisterComponent'
import UserBoard from './../components/UserBoardComponent'
import Admin from './../components/AdminComponent'
import Demande from "./../components/Salarie/DemandeComponent"
import Profil from "./../components/Salarie/ProfilComponent.vue"
import Planning from "./../components/Salarie/PlanningComponent.vue"

import AllTeam from "./../components/Drh/AllTeamComponent.vue"
import EditTeam from "./../components/Drh/EditTeamComponent.vue"

import ManagerTeam from "./../components/Drh/ManagerTeamsComponent.vue"
import UserEdit from "./../components/Drh/UserEditComponent.vue"

import ErrorComp from "./../components/ErrorComponent.vue"

import ListDemande from "./../components/Responsable/ListDemandeComponent.vue"

Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                guest: true
            }
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
            meta: {
                guest: true
            }
        },
        { path: '/', redirect: { name: 'userboard' }},
        { path: '/dashboard', redirect: { name: 'planning' }},
        {
            path: '/dashboard',
            name: 'userboard',
            component: UserBoard,
            meta: {
                requiresAuth: true
            },
            children:[
                {
                    path:"demande-conge",
                    name:"Demande de congé",
                    component: Demande
                },
                {
                    path:"profil",
                    name:"Profil",
                    component: Profil
                },
                {
                    path:"planning",
                    name:"planning",
                    component: Planning
                },
                {
                    path:"teams",
                    component:ManagerTeam,
                    children:[
                        {
                            path:":id/edit",
                            name:"team/edit",
                            component: EditTeam,
                            props: true
                        },
                        {
                            path:":id/changeuser",
                            name:"team/changeuser",
                            component: UserEdit,
                            props: true
                        },
                        {
                            path:"",
                            name:"Teams",
                            component:AllTeam
                        }
                    ]
                },
                {
                    path:"salarie",
                    name:"salarie",
                    component: ErrorComp
                },
                {
                    path:"list-demande",
                    name:"list-demande",
                    component: ListDemande
                },
            ]
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin,
            meta: {
                requiresAuth: true,
                is_admin : true
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('jwt') == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            let user = JSON.parse(localStorage.getItem('user'))
            if(to.matched.some(record => record.meta.is_admin)) {
                if(user.is_admin == 1){
                    next()
                }
                else{
                    next({ name: 'userboard'})
                }
            }else {
                next()
            }
        }
    } else if(to.matched.some(record => record.meta.guest)) {
        if(localStorage.getItem('jwt') == null){
            next()
        }
        else{
            next({ name: 'userboard'})
        }
    }else {
        next()
    }
})

export default router