import React, {useEffect, useRef, useState} from 'react';
import {
  CCardBody,
  CBadge,
  CButton,
  CCollapse,
  CDataTable,
  CCard,
  CCardHeader,
  CRow,
  CCol,
  CPagination,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react';
import {useDispatch, useSelector} from 'react-redux';
import {getPromotion, updatePromotion} from './promotion.api.js';
import {globalizedPromotionSelectors, reset} from './promotion.reducer.js';
import {useHistory} from 'react-router-dom';

const Promotion = (props) => {
  const [details, setDetails] = useState([]);
  const selectedPro = useRef({id: null, isLock: false});
  const {initialState} = useSelector((state) => state.promotion);
  const [activePage, setActivePage] = useState(1);
  const [primary, setPrimary] = useState(false);
  const [size] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(getPromotion());
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (activePage > 1) dispatch(getPromotion({page: activePage - 1, size: size, sort: 'createdDate,desc'}));
  }, [activePage]);

  const {selectAll} = globalizedPromotionSelectors;
  const Promotions = useSelector(selectAll);
  const computedItems = (items) => {
    return items.map((item) => {
      return {
        ...item,
        customerType: item.customerType?.name || '',
        description: item.description?.length > 10 ? `${item.description.substring(0, 250)}...` : item.description,
      };
    });
  };
  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  // Code	Tên chương trình bán hàng	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại chương trình bán hàng	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: {width: '1%'},
      filter: false,
    },
    {key: 'name', label: 'Tên chương trình bán hàng', _style: {width: '20%'}},
    {key: 'type', label: 'Loại chương trình', _style: {width: '15%'}},
    {key: 'startTime', label: 'Thời gian bắt đầu', _style: {width: '15%'}},
    {key: 'endTime', label: 'Thời gian kết thúc', _style: {width: '15%'}},
    {key: 'customerType', label: 'Đối tượng áp dụng', _style: {width: '15%'}},
    {key: 'isLock', label: 'Trạng thái', _style: {width: '10%'}},
    {key: 'description', label: 'Mô tả', _style: {width: '20%'}},
    {
      key: 'show_details',
      label: '',
      _style: {width: '10%'},
      filter: false,
    },
  ];

  const getBadge = (status) => {
    switch (status) {
      case false:
        return 'success';
      case true:
        return 'danger';
      default:
        return 'success';
    }
  };

  const getBadgeType = (status) => {
    switch (status) {
      case 'SHORTTERM':
        return 'info';
      default:
        return 'primary';
    }
  };
  const [,] = useState([]);
  const csvContent = computedItems(Promotions)
      .map((item) => Object.values(item).join(','))
      .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreatePromotion = () => {
    history.push(`${props.match.url}new`);
  };
  const toCreateLongTermPromotion = () => {
    history.push(`${props.match.url}new/longterm`);
  };
  const toEditPromotion = (userId) => {
    history.push(`${props.match.url}${userId}/edit`);
  };
  const toEditLongTermPromotion = (userId) => {
    history.push(`${props.match.url}${userId}/longterm`);
  };

  const onFilterColumn = (value) => {
    if (Object.keys(value).length > 0) {
      dispatch(getPromotion({page: 0, size: size, sort: 'createdDate,desc', ...value}));
    }
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      setPrimary(false);
      dispatch(getPromotion());
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  const lockPromotion = () => {
    dispatch(updatePromotion({id: selectedPro.current.id, isLock: !selectedPro.current.isLock}));
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách chương trình bán hàng
        <CButton color="success" variant="outline" className="ml-3" onClick={toCreatePromotion}>
          <CIcon name="cil-plus" /> Thêm mới chương trình ngắn hạn
        </CButton>
        <CButton color="info" variant="outline" className="ml-3" onClick={toCreateLongTermPromotion}>
          <CIcon name="cil-plus" /> Thêm mới chương trình dài hạn
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={computedItems(Promotions)}
          fields={fields}
          columnFilter
          tableFilter
          cleaner
          itemsPerPageSelect={{label: 'Số lượng trên một trang', values: [20, 30, 50]}}
          itemsPerPage={20}
          hover
          sorter
          // loading
          // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
          onPageChange={(val) => console.log('new page:', val)}
          onPagesChange={(val) => console.log('new pages:', val)}
          onPaginationChange={(val) => console.log('new pagination:', val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onTableFilterChange={(val) => console.log('new table filter:', val)}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{index + 1}</td>,
            isLock: (item) => (
              <td>
                <CBadge color={getBadge(item.isLock)}>{item.isLock ? 'Đã khóa' : 'Đang mở'}</CBadge>
              </td>
            ),
            type: (item) => (
              <td>
                <CBadge color={getBadgeType(item.type)}>{item.type === 'SHORTTERM' ? 'NGẮN HẠN' : 'DÀI HẠN'}</CBadge>
              </td>
            ),
            show_details: (item) => {
              return (
                <td className="d-flex py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="mr-3"
                    onClick={() => {
                      item.type === 'SHORTTERM' ? toEditPromotion(item.id) : toEditLongTermPromotion(item.id);
                    }}
                  >
                    <CIcon name="cil-pencil" />
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="mr-3"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon name="cilZoom" />
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      selectedPro.current = {id: item.id, isLock: item.isLock};
                      setPrimary(!primary);
                    }}
                  >
                    <CIcon name={!item.isLock ? 'cilLockLocked' : 'cilLockUnlocked'} />
                  </CButton>
                </td>
              );
            },
            details: (item) => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin người dùng</h5>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Tên chương trình bán hàng:</dt>
                          <dd className="col-sm-9;a5">{item.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Ngày bắt đầu:</dt>
                          <dd className="col-sm-9">{item.startTime}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Ngày kết thúc:</dt>
                          <dd className="col-sm-9">{item.endTime}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Tổng doanh thu:</dt>
                          <dd className="col-sm-9">{item.totalRevenue}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Đối tượng áp dụng</dt>
                          <dd className="col-sm-9">{item.customerType}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Mô tả:</dt>
                          <dd className="col-sm-9">{item.description}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Trạng thái</dt>
                          <dd className="col-sm-9">{item.isLock ? 'Đã khóa' : 'Đang mở'}</dd>
                        </dl>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCollapse>
              );
            },
          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / 20) + 1}
          onActivePageChange={(i) => setActivePage(i)}
        />
      </CCardBody>
      <CModal show={primary} onClose={() => setPrimary(!primary)} color="primary">
        <CModalHeader closeButton>
          <CModalTitle>Khóa chương trình</CModalTitle>
        </CModalHeader>
        <CModalBody>{`Bạn có chắc chắn muốn ${selectedPro.current.isLock ? 'mở khóa' : 'khóa'} chương trình này không?`}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={lockPromotion}>
            Đồng ý
          </CButton>
          <CButton color="secondary" onClick={() => setPrimary(!primary)}>
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default Promotion;
