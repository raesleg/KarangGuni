import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { AdminService } from '../shared/services/admin.service';
import { ActionSheetController, IonSearchbar } from '@ionic/angular';
import { Router } from '@angular/router';
import { Trans } from '../shared/services/models/trans';
import { EChartsOption } from 'echarts';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-tab6',
  templateUrl: 'tab6.page.html',
  styleUrls: ['tab6.page.scss']
})
export class Tab6Page {

  trans: Trans[] = [];

  hourlyTransactionCounts: { [hours: string]: number } = {};
  dailyTransactionCounts: { [daily: string]: number } = {};
  monthlyTransactionCounts: { [month: string]: number } = {};
  yearlyTransactionCounts: { [yearly: string]: number } = {};

  hoursData: { [hours: string]: number } = {};
  dailyData: { [daily: string]: number } = {};
  monthData: { [month: string]: number } = {};
  yearData: { [yearly: string]: number } = {};

  selectedTimeRange: string = 'hours'; // Default to daily
  chartOption: EChartsOption = {}; // Initialize with empty chart options

  @ViewChild('searchBar', {static: false}) searchBar: IonSearchbar;

  constructor(
    private adminService : AdminService,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private router: Router

  ) {}

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure to Log Out?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };


  logout() {
    this.canDismiss().then((confirmed) => {
      if (confirmed) {
        console.log('cleared')
        this.authService.logout();
        this.router.navigate(['login']);
          }
    });
  }

  isWithinToday(createTime: string): boolean {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to the beginning of the day
    console.log('start',todayStart)
  
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // Set to the end of the day
    console.log(todayEnd)
  
    const createTimeDate = new Date(createTime);
    console.log(createTimeDate)
    
    return createTimeDate >= todayStart && createTimeDate <= todayEnd;
  }

  search(event){
    const text = event.target.value;
    this.adminService.getAllTrans().subscribe((allTrans: Trans[]) => {
      if (text && text.trim() !== '') {
        this.trans = this.trans.filter(
          item => item.id.toLowerCase().includes(text.toLowerCase())
        );
      } else {
        this.trans = allTrans
      }
    });  
  }

  clearSearch() {
    this.adminService.getAllTrans().subscribe((allTrans: Trans[]) => {
      this.trans = allTrans
    });
  }

  refresh($event){
    this.searchBar.value = '';
    $event.target.complete();
    this.adminService.getAllTrans().subscribe((allTrans: Trans[]) => {
        this.trans = allTrans
      })
    }


  async ngOnInit() {

    this.adminService.getAllTrans()
    .subscribe(data => {
      this.trans = data
      console.log(this.trans)

      const currentYear = moment().tz("Asia/Singapore").format("YYYY");
      const currentMonth = moment().tz("Asia/Singapore").format("MMM-YYYY");


      this.trans.forEach(item => {
        const hours = moment.utc(item.create_time).tz("Asia/Singapore").add(16, 'hours').format("h:mm A"); 
        console.log(hours)
        const daily = moment.utc(item.create_time).tz("Asia/Singapore").format("DD-MMM-YYYY"); 
        const month = moment.utc(item.create_time).tz("Asia/Singapore").format("MMM-YYYY"); 
        const yearly = moment.utc(item.create_time).tz("Asia/Singapore").format("YYYY");
        console.log(item.create_time)
        console.log(this.isWithinToday)

        if (this.isWithinToday(item.create_time)) {
          if (!this.hoursData[hours]) {
            this.hoursData[hours] = 0;
            this.hourlyTransactionCounts[hours] = 0;
          }
          this.hoursData[hours] += item.amount * 0.1; 
          this.hourlyTransactionCounts[hours]++;
        } else {
          console.log('no')
        }

        //daily and monthly of that current year
        if (yearly === currentYear) {
          if (month === currentMonth) {
          if (!this.dailyData[daily]) {
            this.dailyData[daily] = 0;
            this.dailyTransactionCounts[daily] = 0;
          }
          this.dailyData[daily] += item.amount * 0.1;
          this.dailyTransactionCounts[daily]++;
          }

          if (!this.monthData[month]) {
            this.monthData[month] = 0;
            this.monthlyTransactionCounts[month] = 0;
          }
            this.monthData[month] += item.amount * 0.1; // Add amount to sum for the month
            this.monthlyTransactionCounts[month]++;
        }

        if (!this.yearData[yearly]) {
          this.yearData[yearly] = 0;
          this.yearlyTransactionCounts[yearly] = 0;
        }
        this.yearData[yearly] += item.amount * 0.1;
        this.yearlyTransactionCounts[yearly]++
        
      });

      this.updateChart(); // Update chart after data extraction  
    })
  }

  updateChart() {
    // Calculate data based on selected time range
    let xAxisData: string[] = [];
    let yAxisData: number[] = [];

    switch (this.selectedTimeRange) {
      case 'hours':
        xAxisData = this.getHourlyXAxisData();
        yAxisData = this.getHourlyYAxisData();
        break;
      case 'daily':
        xAxisData = this.getDailyXAxisData();
        yAxisData = this.getDailyYAxisData();
        break;
      case 'monthly':
        xAxisData = this.getMonthlyXAxisData();
        yAxisData = this.getMonthlyYAxisData();
        break;
      case 'yearly':
        xAxisData = this.getYearlyXAxisData();
        yAxisData = this.getYearlyYAxisData();
        break;
      default:
        break;
    }

    const graphic = {
      type: 'group',
      width: '100%',
      height: '100%',
      children: [
        {
          type: 'text',
          left: 'center',
          top: 'top',
          style: {
            fill: '#333', // Text color
            text: `Total Transactions: ${this.trans.length}`,
            font: 'bold 14px Arial'
          }
        }
      ]
    };
    
    this.chartOption = {
      tooltip: { // Tooltip for displaying exact amount on hover
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params) => {
          let tooltip = ''; // Initialize tooltip string
          params.forEach((param) => {
            tooltip += `Total Revenue on ${param.name}: SGD ${param.value.toFixed(2)}<br/>`; // Add basic tooltip info for each data point
          });
        
          // Determine the time range and retrieve the corresponding count
          let count;
          switch (this.selectedTimeRange) {
            case 'hours':
              const hours = params[0].name; 
              count = this.hourlyTransactionCounts[hours]; 
              tooltip += `Total Transactions on ${hours}: ${count}`; 
              break;
            case 'daily':
              const day = params[0].name; 
              count = this.dailyTransactionCounts[day]; 
              tooltip += `Total Transactions on ${day}: ${count}`; 
              break;
            case 'monthly':
              const month = params[0].name; 
              count = this.monthlyTransactionCounts[month]; 
              tooltip += `Total Transactions in ${month}: ${count}`; 
              break;
            case 'yearly':
              const year = params[0].name; 
              count = this.yearlyTransactionCounts[year]; 
              tooltip += `Total Transactions in ${year}: ${count}`; 
              break;
            default:
              break;
          }
        
          return tooltip;
        }
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        name: 'Time',
        axisLabel: {
          interval: 0, // Show all labels
          rotate: 45, 
          rich: {
            value: {
              lineHeight: 25, 
            },
            text: {
              lineHeight: 15,
              color: '#999', 
            },
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '10% Revenue of Total sales (SGD)'
      },
      series: [
        {
          data: yAxisData,
          type: 'line',
        },
      ],
      graphic: [graphic], // Add the custom graphic element
    };

  }

  getHourlyXAxisData(): string[] {
    return Object.keys(this.hoursData).sort((a, b) => {
      const dateA = moment(a, 'h:mm A');
      const dateB = moment(b, 'h:mm A');
      return dateA.valueOf() - dateB.valueOf();
    });
  }

  getHourlyYAxisData(): number[] {
    const sortedHours = this.getHourlyXAxisData(); // Get sorted hours
    return sortedHours.map(hour => this.hoursData[hour]); // Map sorted hours to corresponding y-axis data
  }
  
  getDailyXAxisData(): string[] {
    return Object.keys(this.dailyData);
  }
  
  getDailyYAxisData(): number[] {
    return Object.values(this.dailyData);
  }
  
  getMonthlyXAxisData(): string[] {
    return Object.keys(this.monthData);
  }
  
  getMonthlyYAxisData(): number[] {
    console.log(this.monthData)
    return Object.values(this.monthData);
  }
  
  getYearlyXAxisData(): string[] {
    return Object.keys(this.yearData);
  }
  
  getYearlyYAxisData(): number[] {
    return Object.values(this.yearData);
  }    
}
