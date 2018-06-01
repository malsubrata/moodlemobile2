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

import { Injectable, Injector } from '@angular/core';
import { CoreCourseModulePrefetchHandlerBase } from '@core/course/classes/module-prefetch-handler';
import { AddonModSurveyProvider } from './survey';
import { AddonModSurveyHelperProvider } from './helper';

/**
 * Handler to prefetch surveys.
 */
@Injectable()
export class AddonModSurveyPrefetchHandler extends CoreCourseModulePrefetchHandlerBase {
    name = 'AddonModSurvey';
    modName = 'survey';
    component = AddonModSurveyProvider.COMPONENT;
    updatesNames = /^configuration$|^.*files$|^answers$/;

    constructor(injector: Injector, protected surveyProvider: AddonModSurveyProvider,
            protected surveyHelper: AddonModSurveyHelperProvider) {
        super(injector);
    }

    /**
     * Download or prefetch the content.
     *
     * @param {any} module The module object returned by WS.
     * @param {number} courseId Course ID.
     * @param {boolean} [prefetch] True to prefetch, false to download right away.
     * @param {string} [dirPath] Path of the directory where to store all the content files. This is to keep the files
     *                           relative paths and make the package work in an iframe. Undefined to download the files
     *                           in the filepool root survey.
     * @return {Promise<any>} Promise resolved when all content is downloaded. Data returned is not reliable.
     */
    downloadOrPrefetch(module: any, courseId: number, prefetch?: boolean, dirPath?: string): Promise<any> {
        const promises = [];

        promises.push(super.downloadOrPrefetch(module, courseId, prefetch));
        promises.push(this.surveyProvider.getSurvey(courseId, module.id).then((survey) => {
            // If survey isn't answered, prefetch the questions.
            if (!survey.surveydone) {
                promises.push(this.surveyProvider.getQuestions(survey.id));
            }
        }));

        return Promise.all(promises);
    }

    /**
     * Returns survey intro files.
     *
     * @param {any} module The module object returned by WS.
     * @param {number} courseId Course ID.
     * @return {Promise<any[]>} Promise resolved with list of intro files.
     */
    getIntroFiles(module: any, courseId: number): Promise<any[]> {
        return this.surveyProvider.getSurvey(courseId, module.id).catch(() => {
            // Not found, return undefined so module description is used.
        }).then((survey) => {
            return this.getIntroFilesFromInstance(module, survey);
        });
    }

    /**
     * Invalidate the prefetched content.
     *
     * @param {number} moduleId The module ID.
     * @param {number} courseId Course ID the module belongs to.
     * @return {Promise<any>} Promise resolved when the data is invalidated.
     */
    invalidateContent(moduleId: number, courseId: number): Promise<any> {
        return this.surveyProvider.invalidateContent(moduleId, courseId);
    }

    /**
     * Invalidate WS calls needed to determine module status.
     *
     * @param {any} module Module.
     * @param {number} courseId Course ID the module belongs to.
     * @return {Promise<any>} Promise resolved when invalidated.
     */
    invalidateModule(module: any, courseId: number): Promise<any> {
        return this.surveyProvider.invalidateSurveyData(courseId);
    }

    /**
     * Whether or not the handler is enabled on a site level.
     *
     * @return {boolean|Promise<boolean>} A boolean, or a promise resolved with a boolean, indicating if the handler is enabled.
     */
    isEnabled(): boolean | Promise<boolean> {
        return true;
    }
}
