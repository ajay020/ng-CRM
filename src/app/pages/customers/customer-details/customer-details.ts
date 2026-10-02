import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../services/customer';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.scss',
})
export class CustomerDetails {
  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);

  customerId = Number(this.route.snapshot.paramMap.get('id'));

  customers = this.customerService.getCustomers();

  selectedCustomer = this.customers().find((customer) => customer.id === this.customerId);
}