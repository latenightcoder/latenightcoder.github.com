
/*ignore jslint start*/

(function (feed, $) {

    feed.timer = null;

    var visible = false;
    var mentionableUsernames = [];

    var enclosedMentionsRegex = /(^|\W)@([^@]+\S)@(?!\w)/g;
    var standardMentionsRegex = /(^|\W)@(\w+)/g;
    var standardUsernameRegex = /^(\w+)$/;

    feed.isVisible = function (value) {
        if (value === true && !visible) {
            visible = true;
            feed.updateFeed();
        } else if (value === false && visible) {
            visible = false;
            $("#feedNewItemBar").hide();
        }

        return visible;
    }

    feed.startTimer = function () {
        if (feed.timer == null) {
            feed.timer = setTimeout("feed.checkUnread()", 60000);
        }
    };

    feed.stopTimer = function () {
        if (feed.timer != null) {
            clearTimeout(feed.timer);
            feed.timer = null;
        }
    };

    feed.isEmptyOrWhitespace = function (text) {
        return text.length == 0 || /^\s+$/.test(text);
    };

    feed.showSavedCommentMessage = function (itemPanel, message, success) {
        if (itemPanel) {
            var span = itemPanel.children('.fi-comment');

            app.hideLoading(span);

            if (!message) {
                message = kendo.culture().strings.serverError;
            }

            span.append('<div class="fi-addcomment-msg">' + message + '</div>');

            if (success == true) {
                span.children('.fi-addcomment-msg').addClass("success");
            } else {
                span.children('.fi-addcomment-msg').addClass("error");
            }
        }
    };

    feed.removeSavedCommentMessage = function (itemPanel, animate) {
        if (itemPanel) {
            if (animate == true) {
                itemPanel.find('.fi-addcomment-msg').fadeOut('fast', function () {
                    itemPanel.find('.fi-addcomment-msg').remove();
                });
            } else {
                itemPanel.find('.fi-addcomment-msg').remove();
            }
        }
    };

    feed.showSaving = function (textArea, submitButton) {
        if (textArea) {
            app.showLoading(textArea.parent());
            textArea.attr("disabled", "disabled");
        }

        if (submitButton) {
            submitButton.attr("disabled", "disabled");
        }
    };

    feed.submitComment = function (itemPanel, textArea) {

        feed.removeSavedCommentMessage(itemPanel);

        if (feed.isEmptyOrWhitespace(textArea.val())) {
            return;
        }

        feed.showSaving(textArea);

        $.post(app.getPath('Feed/AddComment'),
        {
            projectId: itemPanel.attr('data-project-id'),
            entityType: itemPanel.attr('data-entity-type'),
            entityId: itemPanel.attr('data-entity-id'),
            commentType: itemPanel.attr('data-comment-type'),
            comment: textArea.val()
        }
        )
        .success(function (data) {
            if (data.Success == true) {
                itemPanel.find('.fi-comment-text, .fi-comment-img').remove();
                feed.showSavedCommentMessage(itemPanel, kendo.culture().strings.commentAdded, true);
                setTimeout(function () { feed.removeCommentInputArea(itemPanel) }, 3000);
            } else {
                feed.showSavedCommentMessage(itemPanel, data.ErrorMsg, false);
                textArea.removeAttr('disabled');
            }
        })
        .error(function () {
            feed.showSavedCommentMessage(itemPanel, kendo.culture().strings.serverError, false);
            textArea.removeAttr('disabled');
        });
    };

    feed.replyToMessage = function (itemPanel, textArea) {
        feed.removeSavedCommentMessage(itemPanel);

        if (feed.isEmptyOrWhitespace(textArea.val())) {
            return;
        }

        feed.showSaving(textArea);

        $.post(app.getPath('Feed/PostMessage'),
        {
            message: textArea.val()
        })
        .success(function (data) {
            if (data.Success == true) {
                itemPanel.find('.fi-comment-text, .fi-comment-img').remove();
                feed.showSavedCommentMessage(itemPanel, kendo.culture().strings.replyPosted, true);
                setTimeout(function () { feed.removeCommentInputArea(itemPanel) }, 3000);
                feed.updateFeed();
            } else {
                feed.showSavedCommentMessage(itemPanel, data.ErrorMsg, false);
                textArea.removeAttr('disabled');
            }
        })
        .error(function () {
            feed.showSavedCommentMessage(itemPanel, kendo.culture().strings.serverError, false);
            textArea.removeAttr('disabled');
        });
    }

    feed.addCommentInputArea = function (itemPanel, hyperlinkButton) {
        var img = "<img class='fi-img fi-comment-img' src='" + app.currentUser.ImgSrc + "' style='display: none;' />"

        itemPanel.attr('data-comment-type', hyperlinkButton.attr('data-comment-type'));
        itemPanel.append(img);
        itemPanel.append("<span class='fi-comment' style='display: none;'>"
                            + "<textarea class='fi-comment-text' placeholder='" + hyperlinkButton.attr('watermark') + "'></textarea>"
                       + "</span>");

        var textArea = itemPanel.children('.fi-comment').children('.fi-comment-text:first');

        itemPanel.children('.fi-comment, .fi-comment-img').slideDown('fast', function () {
            textArea.autosize();
        });

        textArea.atUsername({
            source: mentionableUsernames,
            moreUsersMessage: kendo.culture().strings.continueTyping,
            noMatchMessage: kendo.culture().strings.noMatch,
            setUsernameListPosition: feed.setUsernameListPosition,
            getElementToAppendUsernameListTo: feed.getElementToAppendUsernameListTo
        });

        textArea.keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13 && !e.shiftKey && !e.isDefaultPrevented()) {
                e.preventDefault();

                var projectId = itemPanel.attr('data-project-id');
                if ($.parseJSON(projectId) == null) {
                    feed.replyToMessage(itemPanel, textArea);
                } else {
                    feed.submitComment(itemPanel, textArea);
                }
            }
        });

        textArea.keyup(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 27) { //Escape                
                var attr = $(this).attr('cancel-close');
                if (typeof attr === 'undefined' || attr === 'false') { // Do not remove the textarea if there is a usernames list opened
                    feed.removeCommentInputArea(itemPanel);
                }
                else {
                    $(this).attr('cancel-close', false);
                }
            }
        });

        if ($.parseJSON(hyperlinkButton.attr('extract-users'))) {
            var author = itemPanel.data('author');
            var authorMentionName = feed.getMentionName(author);
            var content = itemPanel.children('.fi-content:first').text();
            var selectionStartIndex = 0;

            var mentionedUsers = feed.getMentionedUsers(content);
            var replyText = feed.getReplyText(author, mentionedUsers)

            textArea.text(replyText);

            if (replyText.startsWith(authorMentionName)) {
                selectionStartIndex = authorMentionName.length;  // don't select the author
            }

            feed.selectMentionedUsers(textArea[0], selectionStartIndex, replyText.length);
        } else {
            textArea.focus();
        }
    };

    feed.getMentionedUsers = function (content) {
        var mentionedUsers = [];

        addMentionedUsers(enclosedMentionsRegex, content, mentionedUsers);
        content = content.replace(enclosedMentionsRegex, ' ');
        addMentionedUsers(standardMentionsRegex, content, mentionedUsers);

        return mentionedUsers;
    };

    feed.setUsernameListPosition = function (textarea, username_list) {
        var currentFeedUpdate = textarea.closest('li');
        var count = textarea.closest('ul').find('li').length - 1;

        if (currentFeedUpdate.is(':last-child') || currentFeedUpdate.is(':nth-child(' + count + ')')) {
            username_list.css({
                top: 0,
                left: textarea.position().left,
                position: "relative"
            });
        }
        else {
            username_list.css({
                top: textarea.position().top + textarea.outerHeight(),
                left: textarea.position().left
            });
        }
    };

    feed.getElementToAppendUsernameListTo = function (textarea) {
        return textarea.parent().parent();
    }

    function addMentionedUsers(mentionsRegex, content, mentionedUsers) {
        var matches = mentionsRegex.exec(content);

        while (matches) {
            if (matches.length > 2 && $.inArray(matches[2], mentionedUsers) < 0) {
                mentionedUsers.push(matches[2]);
            }

            matches = mentionsRegex.exec(content);
        }
    }

    feed.getReplyText = function (author, mentionedUsers) {
        var replyText = "";
        var authorLower = author.toLocaleLowerCase();
        var currentUserLower = app.currentUser.Username.toLocaleLowerCase();

        if (authorLower.localeCompare(currentUserLower) != 0) {
            replyText = feed.getMentionName(author);
        }

        if (mentionedUsers && mentionedUsers.length && mentionedUsers.length > 0) {
            $.each(mentionedUsers, function () {
                var mentionLower = this.toLocaleLowerCase();
                if (mentionLower.localeCompare(authorLower) != 0 && mentionLower.localeCompare(currentUserLower) != 0) {
                    replyText += feed.getMentionName(this);
                }
            });
        }

        return replyText;
    }

    feed.getMentionName = function (username) {
        if (standardUsernameRegex.test(username)) {
            return "@" + username + " ";
        } else {
            return "@" + username + "@ ";
        }
    };

    feed.selectMentionedUsers = function (textarea, start, end) {
        if (textarea.setSelectionRange) {
            textarea.focus();
            textarea.setSelectionRange(parseInt(start), (parseInt(start) + parseInt(end)));
        } else {
            var range = textarea.createTextRange();
            range.collapse(true);
            range.moveStart('character', parseInt(start));
            range.moveEnd('character', parseInt(end));
            range.select();
        }
    }

    feed.removeCommentInputArea = function (itemPanel) {
        if (itemPanel.length > 0) {
            itemPanel.children('.fi-comment, .fi-comment-img').slideUp('fast', function () {
                itemPanel.children('.fi-comment, .fi-comment-img').remove()
            });
        }
        if ($('.fi-comment').length <= 0) {
            feed.startTimer();
        }
    };

    feed.checkUnread = function () {
        feed.stopTimer();

        $.appAjax(
            app.getPath('NotificationFeed/UnreadActivity'),
            'GET',
            {},
            onUnreadCheckComplete,
            function () {
                feed.startTimer();
            });
    };

    function onUnreadCheckComplete(data) {
        if (data) {
            $("#asBadge").html(data.total);
            if (window.mainApp) {
                window.mainApp.navigationService.setUnreadMessagesCount(data.total);
            }

            if (data.flagged > 0) {
                $("#asBadge").attr('title', kendo.format(kendo.culture().strings.asBadgeNewFlaggedUpdates, data.flagged, data.total));
                $("#asBadge").attr('class', 'flagged');
                $('#asBadge').tipsy({ live: true, delayIn: 500, gravity: 'ne' });
            } else if (data.total > 0) {
                $("#asBadge").attr('title', kendo.format(kendo.culture().strings.asBadgeNewUpdates, data.total));
                $("#asBadge").attr('class', 'new-updates');
                $('#asBadge').tipsy({ live: true, delayIn: 500, gravity: 'ne' });
            } else {
                $("#asBadge").attr('title', kendo.culture().strings.asBadgeNoUpdates);
                $("#asBadge").removeAttr('class');
                $('#asBadge').tipsy({ live: true, delayIn: 500, gravity: 'ne' });
            }

            if (data.total > 0 && visible) {
                $("#feedNewItemBar").html(data.total + ' new items');
                $("#feedNewItemBar").show();
            } else {
                $("#feedNewItemBar").hide();
            }
        }

        feed.startTimer();
    }

    feed.updateFeed = function () {
        feed.stopTimer();

        $.appAjax(
            app.getPath('Feed/Read'),
            'GET',
            function () {
                return {
                    onlyFlagged: $('#showOnlyFlagged').val()
                };
            },
            function (data) {
                var feedItemList = $("#feedPane").find("#feedItemList");
                var feedContainer = feedItemList.parent();
                app.hideLoading(feedContainer);

                if (data && data.length > 0 && data[0].length > 0) {
                    feedContainer.children(".no-data").remove();
                    feedItemList.html(kendo.render(kendo.template($("#feedItemTemplate").html()), data[0]));

                    $('.fi-addcomment-link').click(function () {
                        var itemPanel = $(this).parent().parent();
                        var hyperlinkButton = $(this);
                        if (itemPanel.has('.fi-comment').length > 0) {
                            if (hyperlinkButton.attr('data-comment-type') == itemPanel.attr('data-comment-type')) {
                                feed.removeCommentInputArea(itemPanel);
                            } else {
                                feed.updateCommentTypeAndWatermark(itemPanel, hyperlinkButton);
                            }
                        } else {
                            feed.addCommentInputArea(itemPanel, hyperlinkButton);
                        }
                    });

                    feed.markItemsAsSeen(feedItemList.find('li').attr('data-activity-id'), $('#onlyFlagged').hasClass('active'));
                } else {
                    if (feedContainer.children(".no-data").length == 0) {
                        feedContainer.append(kendo.format('<p class="no-data">{0} <a href="{1}" target="_blank">{2}</a></p>', kendo.culture().strings.noFeedItemsMsg, kendo.culture().strings.activityStreamInfoUrl, kendo.culture().strings.moreInfo));
                    }
                    feedItemList.empty();
                    feed.startTimer();
                }

                mentionableUsernames = data[1] || [];
                $('#personalMessage').atUsername({
                    source: mentionableUsernames,
                    moreUsersMessage: kendo.culture().strings.continueTyping,
                    noMatchMessage: kendo.culture().strings.noMatch,
                    setUsernameListPosition: feed.setUsernameListPosition,
                    getElementToAppendUsernameListTo: feed.getElementToAppendUsernameListTo
                });
            },
            function () {
                feed.startTimer();
            });
    }

    feed.updateCommentTypeAndWatermark = function (itemPanel, hyperlinkButton) {
        itemPanel.attr('data-comment-type', hyperlinkButton.attr('data-comment-type'));
        itemPanel.children('.fi-comment, .fi-comment-img').slideUp('fast').slideDown('slow');

        var textArea = itemPanel.children('.fi-comment').children('.fi-comment-text:first');
        textArea.attr('placeholder', hyperlinkButton.attr('watermark'));
        textArea.focus();
    }

    feed.resetMessage = function () {

        var textArea = $("#personalMessage");
        var submitButton = $("#msgOptions .submit");

        textArea.val('');
        textArea.css("height", '');
        textArea.blur();

        feed.enableControls(textArea, submitButton);

        $("#msgOptions").hide('fast');
    }

    feed.enableControls = function (ctrl1, ctrl2) {
        if (ctrl1) {
            ctrl1.removeAttr("disabled");
        }

        if (ctrl2) {
            ctrl2.removeAttr("disabled");
        }
    };

    feed.postMessage = function () {

        var itemPanel = $("#af-message");
        var textArea = $("#personalMessage");
        var submitButton = $("#msgOptions .submit");
        var messageText = textArea.val();

        feed.removeSavedCommentMessage(itemPanel);

        if (feed.isEmptyOrWhitespace(messageText)) {
            return;
        }

        feed.showSaving(textArea, submitButton);

        $.post(app.getPath('Feed/PostMessage'),
        {
            message: messageText
        })
        .success(function (result) {
            if (result.Success == true) {
                feed.showSavedCommentMessage(itemPanel, kendo.culture().strings.messagePosted, true);
                setTimeout(function () { feed.removeSavedCommentMessage(itemPanel, true); }, 3000);
                feed.resetMessage();
                feed.updateFeed();
            } else {
                feed.showSavedCommentMessage(itemPanel, result.ErrorMsg, false);
                feed.enableControls(textArea, submitButton);
            }
        })
        .error(function () {
            feed.showSavedCommentMessage(itemPanel, kendo.culture().strings.serverError, false);
            feed.enableControls(textArea, submitButton);
        });
    };

    feed.updateShowOnlyFlagged = function (showOnlyFlagged) {
        if ((showOnlyFlagged && $('#allUpdates').hasClass('active')) ||
            (!showOnlyFlagged && $('#onlyFlagged').hasClass('active'))) {
            $('#allUpdates').toggleClass('active');
            $('#onlyFlagged').toggleClass('active');
            $('#showOnlyFlagged').val(showOnlyFlagged);
            feed.updateFeed();
        }
    }

    feed.markItemsAsSeen = function (latestActivityId, onlyFlagged) {
        $.ajax({
            type: "PUT",
            url: app.getPath("Feed/MarkFeedItemsAsSeen"),
            data: {
                latestSeenActivityId: latestActivityId,
                onlyFlagged: onlyFlagged
            },
            success: function (data) {
                onUnreadCheckComplete(data.Data);
            },
            error: function () {
                feed.startTimer();
            }
        });
    }

    feed.init = function () {
        var feedPane = $("#feedPane");
        feedPane.jScrollPane({ autoReinitialise: true });

        $("#personalMessage")
            .autosize()
            .focus(function () {
                $("#msgOptions").show('fast');
            })
            .live('blur', function () {
                if ($(this).val() == "") $("#msgOptions").hide('fast');
            });

        $("#msgOptions .submit").click(feed.postMessage);

        $('#allUpdates').click(function () {
            feed.updateShowOnlyFlagged(false);
        });

        $('#onlyFlagged').click(function () {
            feed.updateShowOnlyFlagged(true);
        });

        $("#feedNewItemBar").click(function () {
            if ($('#allUpdates').hasClass('active')) {
                feed.updateFeed();
            } else {
                feed.updateShowOnlyFlagged(false);
            }
        });

        feed.checkUnread();
    };

})(window.feed = window.feed || {}, jQuery);

    $(document).ready(function () {
        feed.init();
        $('#personalMessage')
        .keydown(function (e) {
            if (e.ctrlKey && e.keyCode == 13) {
                if ($(this).val != "") {
                    $("#msgOptions .submit").trigger('click');
                }
            }
        });
});

/*ignore jslint end*/

