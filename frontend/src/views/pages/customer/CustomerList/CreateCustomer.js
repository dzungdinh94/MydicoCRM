import React, { useEffect, useRef, useState } from 'react';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CInvalidFeedback,
  CFormGroup,
  CLabel,
  CInput,
  CRow,
  CCardTitle
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingCustomer, getCity, getCustomerStatus, getCustomerType, getDistrict } from '../customer.api';

import Select from 'react-select';
import { useHistory } from 'react-router-dom';
import { fetching } from '../customer.reducer';
import { getDepartment } from '../../user/UserDepartment/department.api';
import { globalizedDepartmentSelectors } from '../../user/UserDepartment/department.reducer';
import { getCodeByCustomer, validate } from '../../../../shared/utils/normalize';
import cities from '../../../../shared/utils/city'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const { selectAll } = globalizedDepartmentSelectors;

const validationSchema = function() {
  return Yup.object().shape({
    contactName: Yup.string()
      .min(3, `Họ và tên khách hàng phải lớn hơn 3 kí tự`)
      .required('Họ và tên khách hàng không để trống'),
    name: Yup.string()
      .min(3, `Tên phải lớn hơn 3 kí tự`)
      .required('Tên không để trống'),
    tel: Yup.string()
      .matches(phoneRegExp, 'Số điện thoại không đúng')
      .required('Số điện thoại không để trống'),
    type: Yup.object().required('Loại khách hàng không để trống'),
    dateOfBirth: Yup.date().required('Ngày tháng năm sinh không để trống'),
    department: Yup.object().required('Chi nhánh không để trống'),
    city: Yup.string().required('Thành phố không để trống')
  });
};

const CreateCustomer = () => {
  const ref = useRef(null);
  const { initialState } = useSelector(state => state.customer);
  const initialValues = {
    code: '',
    name: '',
    contactName: '',
    email: '',
    tel: '',
    address: '',
    createdYear: '',
    obclubJoinTime: ''
  };

  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedCity, setSelectedCity] = useState(null);
  const [districts, setDistricts] = useState([])
  const departments = useSelector(selectAll);
  useEffect(() => {
    dispatch(getCustomerType({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
    dispatch(getDepartment({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
    dispatch(getCustomerStatus({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
  }, []);

  const onSubmit = (values, { resetForm }) => {
    dispatch(fetching());
    dispatch(creatingCustomer(values));
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const renderCustomerCode = () => {
    const codeName = getCodeByCustomer(ref.current.values.name);
    const code = `${ref.current.values.department?.code || ''}_${ref.current.values.type?.code || ''}_${codeName}`;
    ref.current.setFieldValue('code', `${code}`);
  };

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Thêm mới khách hàng</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initialValues} innerRef={ref} validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({
            values,
            errors,

            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,

            handleReset
          }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CRow>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="code">Mã khách hàng</CLabel>
                    <CInput
                      type="text"
                      name="code"
                      id="code"
                      placeholder="Mã khách hàng"
                      disabled
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.code}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Tên cửa hàng/đại lý</CLabel>
                    <CInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Tên cửa hàng/đại lý"
                      autoComplete="family-name"
                      invalid={errors.name}
                      required
                      onChange={async e => {
                        await handleChange(e);
                        renderCustomerCode();
                      }}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    <CInvalidFeedback>{errors.name}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Họ và tên khách hàng</CLabel>
                    <CInput
                      type="text"
                      name="contactName"
                      id="contactName"
                      placeholder="Người liên lạc"
                      autoComplete="contactName"
                      invalid={errors.contactName}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.contactName}
                    />
                    <CInvalidFeedback>{errors.contactName}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="tel">Số điện thoại</CLabel>
                    <CInput
                      type="tel"
                      name="tel"
                      id="tel"
                      placeholder="Số điện thoại"
                      autoComplete="phone"
                      invalid={errors.tel}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.tel}
                    />
                    <CInvalidFeedback>{errors.tel}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel>Ngày tháng năm sinh</CLabel>
                    <CInput
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.dateOfBirth}
                      invalid={errors.dateOfBirth}
                      placeholder="Ngày tháng năm sinh"
                    />
                    <CInvalidFeedback>{errors.dateOfBirth}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="email">Email</CLabel>
                    <CInput
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      autoComplete="email"
                      invalid={errors.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <CInvalidFeedback>{errors.email}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
                <CCol lg="6">
                  <CRow>
                    <CCol md={6}>
                      <CFormGroup>
                        <CLabel htmlFor="password">Tỉnh thành</CLabel>
                        <Select
                          name="city"
                          onChange={e => {
                            setFieldValue('city', e.value);
                            setSelectedCity(e.value);
                          }}
                          placeholder="Chọn thành phố"
                          options={cities.map(item => ({
                            value: item.value,
                            label: item.label
                          }))}
                        />
                        <CInvalidFeedback className="d-block">{errors.city}</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol md={6}>
                      <CFormGroup>
                        <CLabel htmlFor="password">Quận huyện</CLabel>
                        <Select
                          name="district"
                          onChange={e => {
                            setFieldValue('district', e.value);
                          }}
                          placeholder="Chọn Quận huyện"
                          options={districts.map(item => ({
                            value: item.value,
                            label: item.label
                          }))}
                        />
                        <CInvalidFeedback className="d-block">{errors.districts}</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Địa chỉ</CLabel>
                    <CInput
                      type="text"
                      name="address"
                      id="address"
                      placeholder="Địa chỉ"
                      autoComplete="address"
                      onChange={handleChange}
                      invalid={errors.address}
                      onBlur={handleBlur}
                      value={values.address}
                    />
                    <CInvalidFeedback>{errors.address}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Loại khách hàng</CLabel>
                    <Select
                      name="type"
                      onChange={async item => {
                        await setFieldValue('type', item.value);
                        renderCustomerCode();
                      }}
                      placeholder="Chọn loại khách hàng"
                      options={initialState.type.map(item => ({
                        value: item,
                        label: item.name
                      }))}
                    />
                    <CInvalidFeedback className="d-block">{errors.type}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Chi nhánh</CLabel>
                    <Select
                      name="department"
                      onChange={async item => {
                        await setFieldValue('department', item.value);
                        renderCustomerCode();
                      }}
                      placeholder="Chi nhánh"
                      options={departments.map(item => ({
                        value: item,
                        label: item.name
                      }))}
                    />
                    <CInvalidFeedback className="d-block">{errors.department}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Trạng thái</CLabel>
                    <Select
                      name="status"
                      onChange={item => {
                        setFieldValue('status', item.value);
                      }}
                      placeholder="Trạng thái"
                      options={initialState.status.map(item => ({
                        value: item,
                        label: item.name
                      }))}
                    />
                    <CInvalidFeedback className="d-block">{errors.status}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="createdYear">Năm thành lập</CLabel>
                    <CInput
                      type="text"
                      name="createdYear"
                      id="createdYear"
                      autoComplete="createdYear"
                      onChange={handleChange}
                      valid={errors.createdYear}
                      onBlur={handleBlur}
                      value={values.createdYear}
                    />
                    <CInvalidFeedback>{errors.createdYear}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="email">Ngày tham gia ObClub</CLabel>
                    <CInput type="date" id="obclubJoinTime" name="obclubJoinTime" onChange={handleChange} />
                    <CInvalidFeedback>{errors.obclubJoinTime}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Tạo mới'}
                </CButton>
                <CButton type="reset" size="lg" color="danger" onClick={handleReset} className="ml-5">
                  <CIcon name="cil-ban" /> Xóa nhập liệu
                </CButton>
              </CFormGroup>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default CreateCustomer;
