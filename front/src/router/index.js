import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import HomeView from '../views/public/HomeView.vue'
import RegisterView from '../views/public/RegisterView.vue'
import LoginView from '../views/public/LoginView.vue'
import UsersView from '../views/admin/UsersView.vue'
import EditUserView from '../views/admin/EditUserView.vue'

function AdminAuth(to, from, next){
  if(localStorage.getItem('tk') != undefined){

    var req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('tk')
      }
    }

    axios.post("http://localhost:8080/validate",{},req).then(() => {
      next();
    }).catch(() => {

      next("/");
    });
  }else{
    next("/");
  }
}

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
    beforeEnter: AdminAuth
  },
  {
    path: '/admin/user/edit/:id',
    name: 'userEdit',
    component: EditUserView,
    beforeEnter: AdminAuth
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
