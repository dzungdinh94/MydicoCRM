import React, { useEffect, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CPagination } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
// import { getCustomerStatus } from '../customer.api.js';
import { useHistory } from 'react-router-dom';
import { getCustomerStatus } from './customer-status.api.js';
import { globalizedcustomerStatuselectors, reset } from './customer-status.reducer.js';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
const { selectAll } = globalizedcustomerStatuselectors;

const CustomerStatus = props => {
  const [details, setDetails] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.customerStatus);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  const customerStatuses = useSelector(selectAll);
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(getCustomerStatus({ page: activePage - 1, size: size, sort: 'createdDate,DESC' }));
  }, [activePage, size]);

  const toggleDetails = index => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  // Code	Tên cửa hàng/đại lý	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại khách hàng	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: { width: '1%' },
      filter: false
    },
    { key: 'name', label: 'Tên trạng thái', _style: { width: '15%' } },
    { key: 'description', label: 'Mô tả', _style: { width: '15%' } },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false
    }
  ];

  const getBadge = status => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'secondary';
      case 'Pending':
        return 'warning';
      case 'Banned':
        return 'danger';
      default:
        return 'primary';
    }
  };
  const [,] = useState([]);
  const csvContent = customerStatuses.map(item => Object.values(item).join(',')).join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateCustomer = () => {
    history.push(`${props.match.url}/new`);
  };

  const onFilterColumn = value => {
    if (Object.keys(value).length > 0) {
      dispatch(getCustomerStatus({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }
  };

  const toEditCustomerStatus = statusId => {
    history.push(`${props.match.url}/${statusId}/edit`);
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách trạng thái khách hàng
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/customer-statuses').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateCustomer}>
            <CIcon name="cil-plus" /> Thêm mới
          </CButton>
        )}
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={customerStatuses}
          fields={fields}
          columnFilter
          tableFilter
          cleaner
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [20, 30, 50] }}
          itemsPerPage={size}
          hover
          sorter
          // loading
          // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
          onPageChange={val => console.log('new page:', val)}
          onPagesChange={val => console.log('new pages:', val)}
          onPaginationChange={val => setSize(val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onTableFilterChange={val => console.log('new table filter:', val)}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{index + 1}</td>,
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
              </td>
            ),
            show_details: item => {
              return (
                <td className="d-flex py-2">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/customer-statuses').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        toEditCustomerStatus(item.id);
                      }}
                    >
                      <CIcon name="cil-pencil" />
                    </CButton>
                  )}
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon name="cil-user" />
                  </CButton>
                </td>
              );
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin trạng thái khách hàng</h5>
                    <dl className="row">
                      <dt className="col-sm-2">Tên trạng thái khách hàng:</dt>
                      <dd className="col-sm-9">{item.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-2">Mô tả:</dt>
                      <dd className="col-sm-9">{item.description}</dd>
                    </dl>
                  </CCardBody>
                </CCollapse>
              );
            }
          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / size) + 1}
          onActivePageChange={i => setActivePage(i)}
        />
      </CCardBody>
    </CCard>
  );
};

export default CustomerStatus;
