import { request } from 'umi';

export interface Review {
  id: string;
  appointmentId: string;
  customerId: string;
  serviceId: string;
  employeeId: string;
  rating: number; // 1-5 sao
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Key for localStorage
const STORAGE_KEY = 'salon_reviews';

// Get reviews from localStorage
const getStoredReviews = (): Review[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

// Save reviews to localStorage
const saveReviewsToStorage = (reviews: Review[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
};

// Get all reviews
export async function getReviews() {
  const reviews = getStoredReviews();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: reviews,
        success: true,
      });
    }, 300);
  });
}

// Get review by id
export async function getReview(id: string) {
  const reviews = getStoredReviews();
  const review = reviews.find(r => r.id === id);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: review,
        success: true,
      });
    }, 300);
  });
}

// Add new review
export async function addReview(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) {
  const reviews = getStoredReviews();
  const newReview: Review = {
    ...data,
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  reviews.push(newReview);
  saveReviewsToStorage(reviews);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: newReview,
        success: true,
      });
    }, 300);
  });
}

// Update review
export async function updateReview(data: Review) {
  const reviews = getStoredReviews();
  const index = reviews.findIndex(r => r.id === data.id);
  
  if (index > -1) {
    reviews[index] = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveReviewsToStorage(reviews);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: reviews[index],
        success: true,
      });
    }, 300);
  });
}

// Delete review
export async function deleteReview(id: string) {
  const reviews = getStoredReviews();
  const filteredReviews = reviews.filter(r => r.id !== id);
  saveReviewsToStorage(filteredReviews);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
      });
    }, 300);
  });
}

// Get reviews by service
export async function getReviewsByService(serviceId: string) {
  const reviews = getStoredReviews();
  const filteredReviews = reviews.filter(r => r.serviceId === serviceId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: filteredReviews,
        success: true,
      });
    }, 300);
  });
}

// Get reviews by employee
export async function getReviewsByEmployee(employeeId: string) {
  const reviews = getStoredReviews();
  const filteredReviews = reviews.filter(r => r.employeeId === employeeId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: filteredReviews,
        success: true,
      });
    }, 300);
  });
}

// Get average rating by service
export async function getAverageRatingByService(serviceId: string) {
  const reviews = getStoredReviews();
  const serviceReviews = reviews.filter(r => r.serviceId === serviceId);
  const averageRating = serviceReviews.length > 0
    ? serviceReviews.reduce((acc, curr) => acc + curr.rating, 0) / serviceReviews.length
    : 0;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: averageRating,
        success: true,
      });
    }, 300);
  });
} 