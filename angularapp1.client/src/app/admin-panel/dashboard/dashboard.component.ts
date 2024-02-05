// app.component.ts
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AdminPanelService } from '../admin-panel.service';
import { PieChartDashboard } from '../../models/BusinessModels/PieChartDashboard';
import { map } from 'rxjs';
import { Revenue } from '../../models/BusinessModels/Revenue';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  title = 'chartDemo';
  numebrOfTransactions: PieChartDashboard[] = [];
  revenue: Revenue[] = [];
  constructor(private adminService: AdminPanelService,private accountService:AccountService) { }
  totalIncome: number = 0
  totalUsers: number = 0;
  ngOnInit() {
    this.accountService.checkLoginStatus().subscribe({
      next: (response: any) => {
        if (response) {
          this.accountService.loggedIn = true;

        }

      },
      error: (error: any) => {
        if (error.error.errors) {

        } else {

        }
      }
    })
    this.adminService.getTotalRevenue().subscribe((response) => {
      console.log(response)
      this.totalIncome = response.reduce((sum: number, item: { totalRevenue: any }) => {
        const revenue = parseFloat(item.totalRevenue) || 0; 
        return sum + revenue;
      }, 0);
    });
    this.adminService.getTotalUsers().subscribe((response) => {
      console.log("ilosc uzytkownikow",response)
      this.totalUsers = response.number;
    });

        this.adminService.getDataForChart().pipe(
      map((response: any) => {
        console.log(response)
        return response.map((item: any) => ({
          itemName: item.itemName,
          count: item.count,
          dateOfTransacton: item.LastTransactionDateString,
          price: item.price
        })) as PieChartDashboard[];
      })
    ).subscribe({
      next: (data: PieChartDashboard[]) => {
        this.numebrOfTransactions = data;
        
        const label = this.numebrOfTransactions.map(item => item.itemName);
        const datal = this.numebrOfTransactions.map(item => item.count);
        const colors = [
          'rgb(255, 205, 0)',
          'rgb(38, 205, 0)',
          'rgb(38, 205, 226)',
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 159, 64)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)'
        ];

        const backgroundColors = colors.slice(0, data.length);
        var myChart = new Chart("myChart", {
          type: 'pie',
          data: {
            labels: label,
            datasets: [{
              label: 'Transakcje',
              data: datal,
              backgroundColor: backgroundColors,
              hoverOffset: 4
            }]
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: 'Ilość transakcji dla poszczególnego planu treningowego',
                color: 'rgb(255, 255, 255)',
                font: {
                  size: 20
                }
              },
              legend: {
                position: 'bottom',
                labels: {
                  color: 'rgb(255, 255, 255)'
                }
              }
            }
          }
        });
      },
      error: (error: any) => {
        console.error('Błąd pobierania danych z serwera:', error);
      }
    });

    
    this.adminService.getRevenue().pipe(
      map((response: any) => {
        console.log(response)
        return response.map((revenue: any) => ({
          dateOfTransacton: this.convertIsoDateToCustomFormat(revenue.lastTransactionDateString),
          Revenue: revenue.revenue
        })) as Revenue[];
      })
    ).subscribe({
      next: (data: Revenue[]) => {
        this.revenue = data;
        console.log("revenue", data);

        const chartData = {
          labels: this.revenue.map(item => item.dateOfTransacton),
          datasets: [
            {
              label: 'Zarobek łączny[$]',
              data: this.revenue.map(item => item.Revenue),
              backgroundColor: 'rgba(0, 0, 0)', 
              borderColor: 'rgba(0, 0, 0)',
              pointBackgroundColor: this.revenue.map(item => 'rgba(0, 0, 0)'),
              pointRadius: 6, 
              pointStyle: 'rectRot', 
              borderWidth: 1
            }
          ]
        };
        console.log("djkvbdksjbvfdksj",this.revenue)
        var myChart1 = new Chart("myChartLine", {
          type: 'line', 
          data: chartData,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Zarobek łączny dla poszczególnego dnia tygodnia [$]'
              },
            },
            interaction: {
              intersect: false,
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Zarobek [$]'
                },
                ticks: {
                  stepSize: 51
                },
                suggestedMin: 0,
              }
            },
          }
        });
      }
    });
    

  }
  private convertIsoDateToCustomFormat(isoDate: any): string {
    const dateObject = new Date(isoDate);

    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = dateObject.getFullYear();

    return `${day}.${month}.${year}`;
  }
  /*private mapTotalRevenue(total: any[]): number[] {
    return total.map(item => ({
      TotalRevenue: item.totalRevenue,
    }));
  }*/
}
