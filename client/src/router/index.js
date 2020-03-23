import Vue from 'vue';
import VueRouter from 'vue-router';
import ApolloComponents from '../views/ApolloComponents.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'ApolloComponents',
		component: ApolloComponents
	},
	{
		path: '/about',
		name: 'ApolloEvent',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(/* webpackChunkName: "about" */ '../views/ApolloEvent.vue')
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
