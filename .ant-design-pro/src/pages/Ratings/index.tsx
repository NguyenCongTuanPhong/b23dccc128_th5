import React from 'react';
import { connect, Loading } from 'umi';
import type { Employee } from '@/models/Employee';
import type { Rating } from '@/models/Rating';
import { RatingList } from './RatingList';

export default connect(({ 
  rating,
  employee, 
  loading 
}: { 
  rating: { ratings: Rating[], employeeAverageRatings: any },
  employee: { employees: Employee[] },
  loading: Loading 
}) => ({
  ratings: rating.ratings,
  employees: employee.employees,
  employeeAverageRatings: rating.employeeAverageRatings,
  loading: loading.effects['rating/fetchRatings'],
}))(RatingList); 