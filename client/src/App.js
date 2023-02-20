import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useEffect } from 'react';
import { Container } from 'reactstrap';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './store';

// Import components
import PostsList from './components/PostsList';
import Navigation from './components/Navigation';
import FooterComponent from './components/FooterComponent';
import AppBreadcrumbs from './components/AppBreadcrumbs';
import SinglePost from './components/SinglePost';
import LoginComponent from './components/LoginComponent';
import LogoutComponent from './components/LogoutComponent';
import RegisterComponent from './components/RegisterComponent';
import UserProfileComponent from './components/UserProfileComponent';
import NotFoundComponent from './components/NotFoundComponent';
import PrivateRoute from './components/PrivateRoute';

// Import authentication actions
import { loadUser } from './actions/authActions';

const routes = [
	{
		path: '/',
		exact: true,
		main: (props) => <PostsList {...props} />,
	},
	{
		path: '/post/:id',
		exact: true,
		main: (props) => <SinglePost {...props} />,
	},
	{
		path: '/login',
		exact: false,
		main: (props) => <LoginComponent {...props} />,
	},
	{
		path: '/logout',
		exact: false,
		main: (props) => <LogoutComponent {...props} />,
	},
	{
		path: '/register',
		exact: false,
		main: (props) => <RegisterComponent {...props} />,
	},
	{
		path: '/user-profile',
		exact: false,
		main: UserProfileComponent,
		private: true,
	},
	{
		path: '',
		exact: false,
		main: (props) => <NotFoundComponent {...props} />,
	},
];

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	});

	return (
			<div className="app">
				<Router basename={(process.env.NODE_ENV === 'production') ? process.env.REACT_APP_BASENAME : '/'}>
					<Provider store={store}>
						<Navigation />
						<Container>
							<AppBreadcrumbs />
							<Container>
								<Switch>
									{routes.map((route) => {
										return route.private ? (
											<PrivateRoute
												key={route.path}
												path={route.path}
												exact={route.exact}
												component={route.main}
											/>
										) : (
											<Route
												key={route.path}
												path={route.path}
												exact={route.exact}
												render={route.main}
											/>
										);
									})}
								</Switch>
							</Container>
						</Container>
						<FooterComponent />
					</Provider>
				</Router>
			</div>
	);
};

export default App;
