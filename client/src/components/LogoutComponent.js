import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../actions/authActions';

function LogoutComponent({ logout }) {
  useEffect(() => {
    logout();
  });

  return (
    <div>
      <Redirect to="/" />
    </div>
  );
}

LogoutComponent.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default connect(null, { logout })(LogoutComponent);
