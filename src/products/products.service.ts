import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  private products = [
  {
    id: 1,
    title: 'Login API',
    assignee: 'Rahul',
    status: 'In Progress',
    priority: 'High',
    tags: ['NestJS', 'API'],
  },
  {
    id: 2,
    title: 'Dashboard UI',
    assignee: 'Aman',
    status: 'Todo',
    priority: 'Medium',
    tags: ['React', 'UI'],
  },
  {
    id: 3,
    title: 'Database Setup',
    assignee: 'Priya',
    status: 'Completed',
    priority: 'High',
    tags: ['PostgreSQL', 'Database'],
  },
  {
    id: 4,
    title: 'Payment Integration',
    assignee: 'Sara',
    status: 'In Progress',
    priority: 'High',
    tags: ['API', 'Payment'],
  },
  {
    id: 5,
    title: 'React Components',
    assignee: 'Dev',
    status: 'Completed',
    priority: 'Medium',
    tags: ['React', 'Components'],
  },
  {
    id: 6,
    title: 'CI/CD Pipeline',
    assignee: 'Rahul',
    status: 'Todo',
    priority: 'Medium',
    tags: ['DevOps', 'CI/CD'],
  },
  {
    id: 7,
    title: 'API Testing',
    assignee: 'Aman',
    status: 'In Progress',
    priority: 'Low',
    tags: ['Postman', 'API'],
  },
  {
    id: 8,
    title: 'Authentication UI',
    assignee: 'Priya',
    status: 'Completed',
    priority: 'High',
    tags: ['React', 'Authentication'],
  },
  {
    id: 9,
    title: 'Bug Fixes',
    assignee: 'Sara',
    status: 'In Progress',
    priority: 'High',
    tags: ['Bug', 'Debugging'],
  },
  {
    id: 10,
    title: 'Swagger Documentation',
    assignee: 'Dev',
    status: 'Todo',
    priority: 'Low',
    tags: ['Swagger', 'API'],
  },
];

  getProductById(id: number) {
    return this.products.find(products => products.id === id);
  }

  createProduct(data: any) {
    const newProduct = {
      id: this.products.length + 1,
      ...data,
    };

    this.products.push(newProduct);

    return newProduct;
  }

  updateProduct(id: number, data: any) {
    return this.products.map((product) => {
      if (product.id === id) {
        return { ...product, ...data };
      }
      return product;
    });
  }

 deleteProduct(id: number){
  this.products=this.products.filter(products=> products.id !== id);
  return this.products;
 }

  getProducts(
    status?: string,
    title?: string,
    search?: string,
    priority?: string,
    assignee?: string,
    tags?: string
  ) {
    let result = this.products;

    if(status){
      result = result.filter(product => product.status === status);
    }
    if(priority){
      result = result.filter(product => product.priority === priority);
    }
    if (title){
      result=result.filter(product => product.title.toLowerCase().includes(title.toLowerCase()));
    }
    if (search) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(search.toLowerCase()) ||
          product.assignee.toLowerCase().includes(search.toLowerCase()) ||
          product.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())
      )
  );
}
    if(assignee){
      result = result.filter(product=> product.assignee === assignee);
    }
    if(tags){
      result = result.filter(product => product.tags.includes(tags));
    }
    return result;
 }
}

 