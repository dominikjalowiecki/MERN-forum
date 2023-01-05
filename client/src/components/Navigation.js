import React, { useState, Fragment } from 'react';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	NavbarText,
	Spinner,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	const auth = useSelector((state) => state.auth);

	return (
		<div>
			<Navbar color="dark" dark expand="md">
				<NavbarBrand tag={Link} to="/">MERN forum</NavbarBrand>
				<NavbarToggler onClick={toggle} />
				<Collapse isOpen={isOpen} navbar>
					<Nav className="mr-auto" navbar>
						{auth.isLoading ? (
							<Spinner type="grow" size="sm" color="primary" />
						) : (
							<Fragment>
								{!auth.isAuthenticated ? (
									<Fragment>
										<NavItem>
											<NavLink tag={Link} to="/login">Login</NavLink>
										</NavItem>
										<NavItem>
											<NavLink tag={Link} to="/register">Register</NavLink>
										</NavItem>
									</Fragment>
								) : (
									<Fragment>
										<UncontrolledDropdown nav inNavbar>
											<DropdownToggle nav caret>
												User profile
											</DropdownToggle>
											<DropdownMenu right>
												<Link to="/user-profile">
													<DropdownItem>
														My profile
													</DropdownItem>
												</Link>
												<DropdownItem divider />
												<Link to="/logout">
													<DropdownItem>
														Logout
													</DropdownItem>
												</Link>
											</DropdownMenu>
										</UncontrolledDropdown>
									</Fragment>
								)}
							</Fragment>
						)}
					</Nav>
					<NavbarText>{new Date().toLocaleDateString()}</NavbarText>
				</Collapse>
			</Navbar>
		</div>
	);
};

export default Navigation;
