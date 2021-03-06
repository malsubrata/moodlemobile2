// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, OnInit, Input } from '@angular/core';
import { CoreSitePluginsProvider } from '../../providers/siteplugins';
import { CoreSitePluginsCompileInitComponent } from '../../classes/compile-init-component';

/**
 * Component that displays an assign feedback plugin created using a site plugin.
 */
@Component({
    selector: 'core-site-plugins-assign-feedback',
    templateUrl: 'assign-feedback.html',
})
export class CoreSitePluginsAssignFeedbackComponent extends CoreSitePluginsCompileInitComponent implements OnInit {
    @Input() assign: any; // The assignment.
    @Input() submission: any; // The submission.
    @Input() plugin: any; // The plugin object.
    @Input() userId: number; // The user ID of the submission.
    @Input() configs: any; // The configs for the plugin.
    @Input() canEdit: boolean; // Whether the user can edit.
    @Input() edit: boolean; // Whether the user is editing.

    constructor(sitePluginsProvider: CoreSitePluginsProvider) {
        super(sitePluginsProvider);
    }

    /**
     * Component being initialized.
     */
    ngOnInit(): void {
        // Pass the input and output data to the component.
        this.jsData = {
            assign: this.assign,
            submission: this.submission,
            plugin: this.plugin,
            userId: this.userId,
            configs: this.configs,
            edit: this.edit,
            canEdit: this.canEdit
        };

        if (this.plugin) {
            this.getHandlerData('assignfeedback_' + this.plugin.type);
        }
    }

    /**
     * Invalidate the data.
     *
     * @return {Promise<any>} Promise resolved when done.
     */
    invalidate(): Promise<any> {
        return Promise.resolve();
    }
}
