import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BuildInfo } from '../build-info';
import { GroupsService } from '../services/groups.service';
import {_TRANSLATE} from "../../shared/_services/translation-marker";
import {Breadcrumb} from "../../shared/_components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-historical-releases-apk-test',
  templateUrl: './historical-releases-apk-test.component.html',
  styleUrls: ['./historical-releases-apk-test.component.css']
})
export class HistoricalReleasesApkTestComponent implements OnInit {
  
  title = _TRANSLATE('APK Test Archives')
  breadcrumbs:Array<Breadcrumb> = []
  displayedColumns = [ 'versionTag', 'build', 'releaseType', 'date','buildId', 'releaseNotes'];
  groupsData;
  groupId;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private groupsService: GroupsService, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.breadcrumbs = [
      <Breadcrumb>{
        label: _TRANSLATE('Releases'),
        url: 'releases'
      },
      <Breadcrumb>{
        label: _TRANSLATE('APK Test Archives'),
        url: 'releases/historical-releases-apk-test'
      }
    ]
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    const result = await this.groupsService.getGroupInfo(this.groupId);
    this.groupsData = new MatTableDataSource<BuildInfo>(result.releases.
      filter(e => e.releaseType === 'qa' && e.build === 'APK').map( e => ({...e, dateString: new Date(e.date)})).sort((a, b) => b.date - a.date));
    this.groupsData.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.groupsData.filter = filterValue.trim().toLowerCase();
  }
}
