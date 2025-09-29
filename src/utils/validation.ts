import * as yup from 'yup';

// Common validation schemas
export const authValidation = {
  email: yup
    .string()
    .email('请输入有效的邮箱地址')
    .required('邮箱地址不能为空'),

  password: yup
    .string()
    .min(8, '密码至少需要8位字符')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '密码需要包含大小写字母和数字'
    )
    .required('密码不能为空'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], '两次输入的密码不一致')
    .required('请确认密码'),

  name: yup
    .string()
    .min(2, '姓名至少需要2个字符')
    .max(50, '姓名不能超过50个字符')
    .required('姓名不能为空'),

  phone: yup
    .string()
    .matches(/^1[3-9]\d{9}$/, '请输入有效的手机号码')
    .required('手机号码不能为空'),
};

export const healthDataValidation = {
  weight: yup
    .number()
    .positive('体重必须大于0')
    .max(500, '体重不能超过500kg')
    .required('体重不能为空'),

  height: yup
    .number()
    .positive('身高必须大于0')
    .max(300, '身高不能超过300cm')
    .required('身高不能为空'),

  heartRate: yup
    .number()
    .positive('心率必须大于0')
    .min(30, '心率不能低于30 bpm')
    .max(250, '心率不能超过250 bpm')
    .required('心率不能为空'),

  bloodPressureSystolic: yup
    .number()
    .positive('收缩压必须大于0')
    .min(60, '收缩压不能低于60 mmHg')
    .max(300, '收缩压不能超过300 mmHg')
    .required('收缩压不能为空'),

  bloodPressureDiastolic: yup
    .number()
    .positive('舒张压必须大于0')
    .min(40, '舒张压不能低于40 mmHg')
    .max(200, '舒张压不能超过200 mmHg')
    .required('舒张压不能为空'),

  bloodSugar: yup
    .number()
    .positive('血糖值必须大于0')
    .min(20, '血糖值不能低于20 mg/dL')
    .max(600, '血糖值不能超过600 mg/dL')
    .required('血糖值不能为空'),

  steps: yup
    .number()
    .min(0, '步数不能为负数')
    .max(100000, '步数不能超过100,000步')
    .required('步数不能为空'),
};

// Schema objects
export const loginSchema = yup.object().shape({
  email: authValidation.email,
  password: yup.string().required('密码不能为空'),
});

export const registerSchema = yup.object().shape({
  name: authValidation.name,
  email: authValidation.email,
  password: authValidation.password,
  confirmPassword: authValidation.confirmPassword,
  phone: authValidation.phone.optional(),
});

export const profileSchema = yup.object().shape({
  name: authValidation.name,
  email: authValidation.email,
  phone: authValidation.phone.optional(),
  height: healthDataValidation.height.optional(),
  weight: healthDataValidation.weight.optional(),
  gender: yup.string().oneOf(['male', 'female', 'other']).optional(),
  birthDate: yup.date().max(new Date(), '出生日期不能是未来日期').optional(),
});

export const weightEntrySchema = yup.object().shape({
  weight: healthDataValidation.weight,
  timestamp: yup.date().max(new Date(), '时间不能是未来时间').required('时间不能为空'),
});

export const bloodPressureSchema = yup.object().shape({
  systolic: healthDataValidation.bloodPressureSystolic,
  diastolic: healthDataValidation.bloodPressureDiastolic,
  timestamp: yup.date().max(new Date(), '时间不能是未来时间').required('时间不能为空'),
});

export const heartRateSchema = yup.object().shape({
  heartRate: healthDataValidation.heartRate,
  timestamp: yup.date().max(new Date(), '时间不能是未来时间').required('时间不能为空'),
});

export const bloodSugarSchema = yup.object().shape({
  bloodSugar: healthDataValidation.bloodSugar,
  timestamp: yup.date().max(new Date(), '时间不能是未来时间').required('时间不能为空'),
});

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return authValidation.email.isValidSync(email);
};

export const validatePassword = (password: string): boolean => {
  return authValidation.password.isValidSync(password);
};

export const validatePhone = (phone: string): boolean => {
  return authValidation.phone.isValidSync(phone);
};

// Custom validation functions
export const validateAge = (birthDate: Date): boolean => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 0 && age - 1 <= 150;
  }

  return age >= 0 && age <= 150;
};

export const validateBMI = (weight: number, height: number): { isValid: boolean; bmi?: number; category?: string } => {
  if (weight <= 0 || height <= 0) {
    return { isValid: false };
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  let category = '';
  if (bmi < 18.5) {
    category = '偏瘦';
  } else if (bmi < 24) {
    category = '正常';
  } else if (bmi < 28) {
    category = '超重';
  } else {
    category = '肥胖';
  }

  return {
    isValid: bmi >= 10 && bmi <= 100, // Reasonable BMI range
    bmi: Math.round(bmi * 10) / 10,
    category,
  };
};