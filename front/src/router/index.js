import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomeView.vue'
import RegisterView from '../views/public/RegisterView.vue'
import LoginView from '../views/public/LoginView.vue'
import UsersView from '../views/admin/UsersView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/admin/users',
    name: 'users',
    component: UsersView,
    beforeEnter: (to, from, next) => {
      if(localStorage.getItem('tk') != undefined){
        next();
      }else{
        next('/');
      }
    }
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
