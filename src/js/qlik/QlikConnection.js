const config = {
    host: 'bix-tecnologia.us.qlikcloud.com',
    prefix: '/',
    port: '443',
    isSecure: true,
    webIntegrationId: process.env.REACT_APP_BIX_KEY
}

const baseUrl = (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
//const baseUrl = https://bix-tecnologia.us.qlikcloud.com:443/resources

window.require.config({
    baseUrl: baseUrl,
    webIntegrationId: config.webIntegrationId,
    paths:{
        qlik: baseUrl + '/js/qlik',
    }
})

async function login() {
    function isLoggedIn() {
        return fetch("https://"+config.host+"/api/v1/users/me", {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'qlik-web-integration-id': config.webIntegrationId,
            },
        }).then(response => {
            return response.status === 200;
        });
    }
    return isLoggedIn().then(loggedIn =>{
        if (!loggedIn) {
            window.location.href = "https://"+config.host+"/login?qlik-web-integration-id=" + config.webIntegrationId + "&returnto=" + window.location.href;
            throw new Error('not logged in');
        }
    });
}

const appPromise = new Promise((resolve) => {
    login().then(()=>{
        window.require(['js/qlik'], (qlik) => {
            console.log('API Global Importada', qlik)
            const app = qlik.openApp('58ab4c3a-bb56-4084-a36d-579c5e4542d3', config)
            console.log('App aberto:', app)

            resolve(app)
        })
    })
})


export default appPromise
