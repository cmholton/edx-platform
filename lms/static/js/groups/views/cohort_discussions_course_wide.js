;(function (define) {
    'use strict';
    define(['jquery', 'underscore', 'backbone', 'gettext', 'string_utils', 'js/groups/views/cohort_discussions'],
            function ($, _, Backbone, gettext, interpolate_text, CohortDiscussionConfigurationView) {
                var CourseWideDiscussionsView = CohortDiscussionConfigurationView.extend({
                    events: {
                        'change .check-discussion-subcategory-course-wide': 'discussionCategoryStateChanged',
                        'click .cohort-course-wide-discussions-form .action-save': 'saveCourseWideDiscussionsForm'
                    },

                    initialize: function (options) {
                        this.template = _.template($('#cohort-discussions-course-wide-tpl').text());
                        this.cohortSettings = options.cohortSettings;
                    },

                    render: function () {
                        this.$('.cohort-course-wide-discussions-nav').html(this.template({
                            courseWideTopics: this.getCourseWideDiscussionsHtml(
                                this.model.get('course_wide_discussions')
                            )
                        }));
                        this.setDisabled(this.$('.cohort-course-wide-discussions-form .action-save'), true);
                    },

                    /**
                     * Returns the html list for course-wide discussion topics.
                     * @param {object} courseWideDiscussions - course-wide discussions object from server.
                     * @returns {Array} - HTML list for course-wide discussion topics.
                     */
                    getCourseWideDiscussionsHtml: function (courseWideDiscussions) {
                        var subCategoryTemplate = _.template($('#cohort-discussions-subcategory-tpl').html()),
                            entries = courseWideDiscussions.entries,
                            children = courseWideDiscussions.children;

                        return _.map(children, function (name) {
                            var entry = entries[name];
                            return subCategoryTemplate({
                                name: name,
                                id: entry.id,
                                is_cohorted: entry.is_cohorted,
                                type: 'course-wide'
                            });
                        }).join('');
                    },

                    /**
                     * Enables the save button for course-wide discussions.
                     */
                    discussionCategoryStateChanged: function(event) {
                        event.preventDefault();
                        this.setDisabled(this.$('.cohort-course-wide-discussions-form .action-save'), false);
                    },

                    /**
                     * Sends the cohorted_course_wide_discussions to the server and renders the view.
                     */
                    saveCourseWideDiscussionsForm: function (event) {
                        event.preventDefault();

                        var self = this,
                            courseWideCohortedDiscussions = self.getCohortedDiscussions(
                                '.check-discussion-subcategory-course-wide:checked'
                            ),
                            fieldData = { cohorted_course_wide_discussions: courseWideCohortedDiscussions };

                        self.saveForm(self.$('.course-wide-discussion-topics'),fieldData)
                        .done(function () {
                            self.model.fetch()
                                .done(function () {
                                    self.render();
                                    self.showMessage(gettext('Your changes have been saved.'), self.$('.course-wide-discussion-topics'));
                                }).fail(function() {
                                    var errorMessage = gettext("We've encountered an error. Refresh your browser and then try again.");
                                    self.showMessage(errorMessage, self.$('.course-wide-discussion-topics'), 'error')
                                });
                        });
                    }

                });
                return CourseWideDiscussionsView;
        });
}).call(this, define || RequireJS.define);
