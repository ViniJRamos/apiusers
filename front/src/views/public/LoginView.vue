<template>
    <div>
        <br>
        <h2>Login</h2>    
        <hr>

        <div class="columns is-centered">
            <div class="column is-half">
                <div v-if="error != undefined">
                    <div class="notification is-danger">
                        {{error}}
                    </div>
                </div>
                <p>E-mail</p>
                <input type="email" placeholder="email@email.com" class="input" v-model="email">
                <p>Senha</p>
                <input type="password" placeholder="******" class="input" v-model="password">
                <hr>
                <button class="button is-success" @click="login">Logar</button>
            </div>
        </div>
    </div>    
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return {
            password: '',
            email: '',
            error: undefined,
        }
    },
    methods: {
        login(){
            axios.post("http://localhost:8080/login",{
                password: this.password,
                email: this.email
            }).then(res => {
                localStorage.setItem('tk',res.data.token);
                this.$router.push({name: 'home'});
            }).catch(err => {
                var msgErro = err.response.data.err;
                this.error = msgErro;
            })
        }
    }
}
</script>

<style scoped>
</style>