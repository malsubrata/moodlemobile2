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

import { NgModule } from '@angular/core';
import { AddonModPageComponentsModule } from './components/components.module';
import { AddonModPageModuleHandler } from './providers/module-handler';
import { AddonModPageProvider } from './providers/page';
import { AddonModPagePrefetchHandler } from './providers/prefetch-handler';
import { AddonModPageLinkHandler } from './providers/link-handler';
import { AddonModPagePluginFileHandler } from './providers/pluginfile-handler';
import { AddonModPageHelperProvider } from './providers/helper';
import { CoreContentLinksDelegate } from '@core/contentlinks/providers/delegate';
import { CoreCourseModuleDelegate } from '@core/course/providers/module-delegate';
import { CoreCourseModulePrefetchDelegate } from '@core/course/providers/module-prefetch-delegate';
import { CorePluginFileDelegate } from '@providers/plugin-file-delegate';

@NgModule({
    declarations: [
    ],
    imports: [
        AddonModPageComponentsModule
    ],
    providers: [
        AddonModPageProvider,
        AddonModPageModuleHandler,
        AddonModPageHelperProvider,
        AddonModPagePrefetchHandler,
        AddonModPageLinkHandler,
        AddonModPagePluginFileHandler
    ]
})
export class AddonModPageModule {
    constructor(moduleDelegate: CoreCourseModuleDelegate, moduleHandler: AddonModPageModuleHandler,
            prefetchDelegate: CoreCourseModulePrefetchDelegate, prefetchHandler: AddonModPagePrefetchHandler,
            contentLinksDelegate: CoreContentLinksDelegate, linkHandler: AddonModPageLinkHandler,
            pluginfileDelegate: CorePluginFileDelegate, pluginfileHandler: AddonModPagePluginFileHandler) {
        moduleDelegate.registerHandler(moduleHandler);
        prefetchDelegate.registerHandler(prefetchHandler);
        contentLinksDelegate.registerHandler(linkHandler);
        pluginfileDelegate.registerHandler(pluginfileHandler);
    }
}
