
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
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreTextUtilsProvider } from '@providers/utils/text';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CoreQuestionHandler } from '@core/question/providers/delegate';
import { CoreQuestionHelperProvider } from '@core/question/providers/helper';
import { AddonQtypeEssayComponent } from '../component/essay';

/**
 * Handler to support essay question type.
 */
@Injectable()
export class AddonQtypeEssayHandler implements CoreQuestionHandler {
    name = 'AddonQtypeEssay';
    type = 'qtype_essay';

    protected div = document.createElement('div'); // A div element to search in HTML code.

    constructor(private utils: CoreUtilsProvider, private questionHelper: CoreQuestionHelperProvider,
            private domUtils: CoreDomUtilsProvider, private textUtils: CoreTextUtilsProvider) { }

    /**
     * Return the name of the behaviour to use for the question.
     * If the question should use the default behaviour you shouldn't implement this function.
     *
     * @param {any} question The question.
     * @param {string} behaviour The default behaviour.
     * @return {string} The behaviour to use.
     */
    getBehaviour(question: any, behaviour: string): string {
        return 'manualgraded';
    }

    /**
     * Return the Component to use to display the question.
     * It's recommended to return the class of the component, but you can also return an instance of the component.
     *
     * @param {Injector} injector Injector.
     * @param {any} question The question to render.
     * @return {any|Promise<any>} The component (or promise resolved with component) to use, undefined if not found.
     */
    getComponent(injector: Injector, question: any): any | Promise<any> {
        return AddonQtypeEssayComponent;
    }

    /**
     * Check if a question can be submitted.
     * If a question cannot be submitted it should return a message explaining why (translated or not).
     *
     * @param {any} question The question.
     * @return {string} Prevent submit message. Undefined or empty if can be submitted.
     */
    getPreventSubmitMessage(question: any): string {
        this.div.innerHTML = question.html;

        if (this.div.querySelector('div[id*=filemanager]')) {
            // The question allows attachments. Since the app cannot attach files yet we will prevent submitting the question.
            return 'core.question.errorattachmentsnotsupported';
        }

        if (this.questionHelper.hasDraftFileUrls(this.div.innerHTML)) {
            return 'core.question.errorinlinefilesnotsupported';
        }
    }

    /**
     * Check if a response is complete.
     *
     * @param {any} question The question.
     * @param {any} answers Object with the question answers (without prefix).
     * @return {number} 1 if complete, 0 if not complete, -1 if cannot determine.
     */
    isCompleteResponse(question: any, answers: any): number {
        this.div.innerHTML = question.html;

        const hasInlineText = answers['answer'] && answers['answer'] !== '',
            allowsAttachments = !!this.div.querySelector('div[id*=filemanager]');

        if (!allowsAttachments) {
            return hasInlineText ? 1 : 0;
        }

        // We can't know if the attachments are required or if the user added any in web.
        return -1;
    }

    /**
     * Whether or not the handler is enabled on a site level.
     *
     * @return {boolean|Promise<boolean>} True or promise resolved with true if enabled.
     */
    isEnabled(): boolean | Promise<boolean> {
        return true;
    }

    /**
     * Check if a student has provided enough of an answer for the question to be graded automatically,
     * or whether it must be considered aborted.
     *
     * @param {any} question The question.
     * @param {any} answers Object with the question answers (without prefix).
     * @return {number} 1 if gradable, 0 if not gradable, -1 if cannot determine.
     */
    isGradableResponse(question: any, answers: any): number {
        return 0;
    }

    /**
     * Check if two responses are the same.
     *
     * @param {any} question Question.
     * @param {any} prevAnswers Object with the previous question answers.
     * @param {any} newAnswers Object with the new question answers.
     * @return {boolean} Whether they're the same.
     */
    isSameResponse(question: any, prevAnswers: any, newAnswers: any): boolean {
        return this.utils.sameAtKeyMissingIsBlank(prevAnswers, newAnswers, 'answer');
    }

    /**
     * Prepare and add to answers the data to send to server based in the input. Return promise if async.
     *
     * @param {any} question Question.
     * @param {any} answers The answers retrieved from the form. Prepared answers must be stored in this object.
     * @param {boolean} [offline] Whether the data should be saved in offline.
     * @param {string} [siteId] Site ID. If not defined, current site.
     * @return {void|Promise<any>} Return a promise resolved when done if async, void if sync.
     */
    prepareAnswers(question: any, answers: any, offline: boolean, siteId?: string): void | Promise<any> {
        this.div.innerHTML = question.html;

        // Search the textarea to get its name.
        const textarea = <HTMLTextAreaElement> this.div.querySelector('textarea[name*=_answer]');

        if (textarea && typeof answers[textarea.name] != 'undefined') {
            return this.domUtils.isRichTextEditorEnabled().then((enabled) => {
                if (!enabled) {
                    // Rich text editor not enabled, add some HTML to the text if needed.
                    answers[textarea.name] = this.textUtils.formatHtmlLines(answers[textarea.name]);
                }
            });
        }
    }
}
