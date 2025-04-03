import { request } from 'umi';
import type { Service } from '@/models/Service';

// Mock data
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Cắt tóc nam',
    description: 'Cắt tóc nam theo yêu cầu, bao gồm gội đầu và tạo kiểu',
    price: 100000,
    duration: 30,
  },
  {
    id: '2',
    name: 'Uốn tóc',
    description: 'Uốn tóc theo yêu cầu, bao gồm tư vấn kiểu tóc phù hợp',
    price: 500000,
    duration: 120,
  },
  {
    id: '3',
    name: 'Nhuộm tóc',
    description: 'Nhuộm tóc theo yêu cầu, bao gồm tư vấn màu phù hợp',
    price: 700000,
    duration: 90,
  },
  {
    id: '4',
    name: 'Gội đầu massage',
    description: 'Gội đầu kèm massage thư giãn',
    price: 80000,
    duration: 45,
  },
];

// Sử dụng local storage để lưu trữ tạm thời
let services = [...mockServices];

export async function getServices() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: services,
        success: true,
      });
    }, 300);
  });
}

export async function getService(id: string) {
  const service = services.find(s => s.id === id);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: service,
        success: true,
      });
    }, 300);
  });
}

export async function addService(data: Omit<Service, 'id'>) {
  const newService = {
    ...data,
    id: `${services.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  services.push(newService);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: newService,
        success: true,
      });
    }, 300);
  });
}

export async function updateService(data: Service) {
  const index = services.findIndex(s => s.id === data.id);
  if (index > -1) {
    services[index] = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: services[index],
        success: true,
      });
    }, 300);
  });
}

export async function deleteService(id: string) {
  services = services.filter(s => s.id !== id);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
      });
    }, 300);
  });
} 