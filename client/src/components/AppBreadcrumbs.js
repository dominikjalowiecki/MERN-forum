import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { useLocation, Link } from 'react-router-dom';

const AppBreadcrumbs = () => {
  let location = useLocation();
  let pathname = location.pathname.split('/');

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  return (
    <div className="mt-3">
      {pathname[1] !== '' ? (
        <Breadcrumb>
          {pathname.map((path, idx, arr) => (
            <BreadcrumbItem key={path}>
              <Link to={arr.slice(0, idx + 1).join('/')}>
                {idx ? path.capitalize() : 'Home'}
              </Link>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      ) : (
        ''
      )}
    </div>
  );
};

export default AppBreadcrumbs;
