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
  CSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingCustomer, getBranches, getCity, getCustomerType, getDistrict } from './customer.api';
import Toaster from '../../components/notifications/toaster/Toaster';
import { current } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = function (values) {
  return Yup.object().shape({
    contactName: Yup.string().min(5, `Tên liên lạc phải lớn hơn 5 kí tự`).required('Tên liên lạc không để trống'),
    name: Yup.string().min(5, `Tên phải lớn hơn 5 kí tự`).required('Tên không để trống'),
    tel: Yup.string().matches(phoneRegExp, 'Số điện thoại không đúng').required('Số điện thoại không để trống'),
    city: Yup.string().required('Thành phố không để trống'),
    type: Yup.string().required('Loại khách hàng không để trống'),
    branch: Yup.string().required('Chi nhánh không để trống'),
  });
};

const validate = getValidationSchema => {
  return values => {
    const validationSchema = getValidationSchema(values);
    try {
      validationSchema.validateSync(values, { abortEarly: false });
      console.log(values);
      return {};
    } catch (error) {
      return getErrorsFromValidationError(error);
    }
  };
};

const getErrorsFromValidationError = validationError => {
  const FIRST_ERROR = 0;
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR],
    };
  }, {});
};

const findFirstError = (formName, hasError) => {
  const form = document.forms[formName];
  for (let i = 0; i < form.length; i++) {
    if (hasError(form[i].name)) {
      form[i].focus();
      break;
    }
  }
};

const validateForm = errors => {
  findFirstError('simpleForm', fieldName => {
    return Boolean(errors[fieldName]);
  });
};

const touchAll = (setTouched, errors) => {
  setTouched({
    code: true,
    lastName: true,
    userName: true,
    email: true,
    password: true,
    confirmPassword: true,
    accept: true,
  });
  validateForm(errors);
};

const CreateCustomer = () => {
  const { initialState } = useSelector(state => state.customer);
  const initialValues = {
    code: '',
    name: '',
    contactName: '',
    email: '',
    tel: '',
    dateOfBirth: '',
    city: '',
    district: '',
    address: '',
    branch: '',
    type: '',
    createdYear: '',
    obclubJoinTime: '',
  };
  const toastRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory()
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    dispatch(getCity());
    dispatch(getCustomerType());
    dispatch(getBranches());
  }, []);

  useEffect(() => {
    if (selectedCity) {
      dispatch(getDistrict({ city: selectedCity }));
    }
  }, [selectedCity]);

  const onSubmit = (values, { setSubmitting, setErrors }) => {
    values.code = `${values.branch ? values.branch : initialState.branch[0]?.code}-${
      values.type ? values.type : initialState.type[0]?.code
    }-${values.name.replaceAll(' ', '')}`;
    if (values.branch) {
      const founded = initialState.branch.filter(item => item.code === values.branch);
      if (founded.length > 0) {
        values.branch = founded[0].id;
      }
    }
    if (values.type) {
      const founded = initialState.type.filter(item => item.code === values.type);
      if (founded.length > 0) {
        values.type = founded[0].id;
      }
    }
    dispatch(creatingCustomer(values));
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      toastRef.current.addToast();
      history.goBack()
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <Toaster ref={toastRef} message="Tạo mới khách hàng thành công" />
      <CCardHeader>Thêm mới khách hàng</CCardHeader>
      <CCardBody>
        <Formik initialValues={initialValues} validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({
            values,
            errors,
            touched,
            status,
            dirty,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            isValid,
            handleReset,
            setTouched,
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
                      value={`${values.branch ? values.branch : initialState.branch[0]?.code}-${
                        values.type ? values.type : initialState.type[0]?.code
                      }-${values.name.replaceAll(' ', '')}`}
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
                      valid={!errors.name}
                      invalid={touched.name && !!errors.name}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    <CInvalidFeedback>{errors.name}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Người liên lạc</CLabel>
                    <CInput
                      type="text"
                      name="contactName"
                      id="contactName"
                      placeholder="Người liên lạc"
                      autoComplete="contactName"
                      valid={!errors.contactName}
                      invalid={touched.contactName && !!errors.contactName}
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
                      valid={!errors.tel}
                      invalid={touched.tel && !!errors.tel}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.tel}
                    />
                    <CInvalidFeedback>{errors.tel}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel>Ngày tháng năm sinh</CLabel>
                    <CInput type="date" id="dateOfBirth" name="dateOfBirth" onChange={handleChange} placeholder="Ngày tháng năm sinh" />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="email">Email</CLabel>
                    <CInput
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      autoComplete="email"
                      valid={!errors.email}
                      invalid={touched.email && !!errors.email}
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
                        <CSelect
                          custom
                          name="city"
                          id="city"
                          onChange={e => {
                            const founded = initialState.cities.filter(item => item.code === e.target.value);
                            if (founded.length > 0) {
                              setFieldValue('city', founded[0].id);
                              setSelectedCity(e.target.value);
                            }
                          }}
                        >
                          <option key={0} value={null}>
                            Chọn tỉnh thành
                          </option>
                          {initialState.cities.map(item => (
                            <option key={item.id} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </CSelect>
                        <CInvalidFeedback className="d-block">{errors.city}</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol md={6}>
                      <CFormGroup>
                        <CLabel htmlFor="password">Quận huyện</CLabel>
                        <CSelect custom name="district" id="district" onChange={handleChange}>
                          <option key={0} value={null}>
                            Chọn Quận huyện
                          </option>
                          {initialState.districts.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </CSelect>
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
                      onBlur={handleBlur}
                      value={values.address}
                    />
                    <CInvalidFeedback>{errors.address}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Loại khách hàng</CLabel>
                    <CSelect custom name="ccmonth" name="type" id="type" onChange={handleChange}>
                      <option key={0} value={null}>
                        Chọn loại khách hàng
                      </option>
                      {initialState.type.map(item => (
                        <option key={item.id} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.type}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Chi nhánh</CLabel>
                    <CSelect custom name="branch" id="branch" onChange={handleChange}>
                      <option key={0} value={null}>
                        Chọn chi nhánh
                      </option>
                      {initialState.branch.map(item => (
                        <option key={item.id} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.branch}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="createdYear">Năm thành lập</CLabel>
                    <CInput
                      type="text"
                      name="createdYear"
                      id="createdYear"
                      placeholder="User Name"
                      autoComplete="createdYear"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.createdYear}
                    />
                    <CInvalidFeedback>{errors.createdYear}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="email">Ngày tham gia ObClub</CLabel>
                    <CInput type="date" id="obclubJoinTime" name="obclubJoinTime" onChange={handleChange} placeholder="Ngày tháng năm sinh" />
{/* 
                    <CInput
                      type="text"
                      name="obclubJoinTime"
                      id="obclubJoinTime"
                      placeholder="obclubJoinTime"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.obclubJoinTime}
                    /> */}
                    <CInvalidFeedback>{errors.obclubJoinTime}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="sm" color="primary" disabled={isSubmitting}>
                  <CIcon name="cil-scrubber" /> {isSubmitting ? 'Đang xử lý' : 'Tạo mới'}
                </CButton>
                <CButton type="reset" size="sm" color="danger" onClick={handleReset} className="ml-5">
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
