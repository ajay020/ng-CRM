import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LeadService } from '../../../services/lead';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lead-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './lead-details.html',
  styleUrl: './lead-details.scss',
})
export class LeadDetails {
  private route = inject(ActivatedRoute);
  private leadService = inject(LeadService);

  leadId = this.route.snapshot.paramMap.get('id');

  lead = this.leadService.getLeads();

  selectedLead = this.lead().find((lead) => lead.id === this.leadId);
}
