import { Component, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts/core';

import { BarChart } from 'echarts/charts';  
import {
  GridComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';

echarts.use([
  BarChart,
  GridComponent,
  TooltipComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-department-employee-chart',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './department-employee-chart.component.html',
  styleUrl: './department-employee-chart.component.css',
})
export class DepartmentEmployeeChartComponent {
  public readonly options = input<EChartsCoreOption | null>(null);
}
