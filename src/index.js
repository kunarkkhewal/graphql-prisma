import '@babel/polyfill/noConflict';
// import 'babel-polyfill';
import server from './server';

server.start({ port: process.env.PORT || 4000 }, () => {
    console.log(' SERVER IS UP AND RUNNING!!!');
})