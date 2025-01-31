    function rise_load_completion($topic_id, $lesson_id) {
        $(".iframe-SCORM").on("load", function () {
            console.log('loaded iframe-SCORM !');
    
            let $iframe = $(this);
            let $iframeContents = $iframe.contents();
    
            // Poll for the target element
            let pollInterval = setInterval(() => {
                let $loltracker = $iframeContents.find(".nav-sidebar-header__progress-text");
    
                if ($loltracker.length) {
                    console.log('I have the target!!');
    
                    // Set up MutationObserver
                    let observer = new MutationObserver((mutationsList) => {
                        mutationsList.forEach((mutation) => {
                            let $loltracker2 = $loltracker.html();
                            console.log('I have the target again loltracker!');
                            if ($loltracker2.includes('100')) {
                                console.log('loltracker = 100%!!');
                                $(".iframe-Rise").css('opacity', '0');
                                complete_activity($topic_id, $lesson_id);
    
                                observer.disconnect(); // Stop observing
                                clearInterval(pollInterval); // Stop polling
                            }
                        });
                    });
    
                    // Start observing the target element
                    observer.observe($loltracker[0], { childList: true, subtree: true, characterData: true });
                    clearInterval(pollInterval); // Stop polling after finding the element
                } else {
                    console.log('Waiting for target element...');
                }
            }, 500); // Check every 500ms
        });
    }
