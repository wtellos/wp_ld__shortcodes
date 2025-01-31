jQuery(document).ready(function($){

    // On click activity
    $( "body" ).on( "click", ".return-rise-button",function(event){
        event.preventDefault();
        UIkit.modal('#modal-generic-topics').hide();
        $('.cardet-content-here').html('');
    });

    // Prevents 
    $( "body" ).on( "click", ".cardet-topics  li a, .cardet-topics .uk-card", function(e){
        e.preventDefault();
        //console.log('clicked CARD!');
    });
    
    // Close modal when click the "Return" button
    $("body").on("click", ".return-rise-button", function() {
        $(".uk-modal-close-full").trigger("click");
        console.log('clicked RETURN button!');
    });
    

    
    //On click activity
    $( "body" ).on( "click", ".cardet-topics  li, .cardet-topics .uk-card", function(){

        console.log('clicked');
        console.log('clicked on a Card!');

        $topic_type = $(this).attr('data-topic-type');
        $topic_id = $(this).attr('data-topic-id');
        $lesson_id = $(this).attr('data-lesson-id');

        if ($topic_type == 'quiz') {
            $topic_link = $(this).attr('data-topic-link');
        }
        else {
            $topic_link = $('a', this).attr('href');
        }
        
        //Open link in new tab and complete activity.
        if ($topic_type == 'PDF' || $topic_type == 'Word'  || $topic_type == 'PowerPoint'  || $topic_type == 'Link' || $topic_type == 'Video' ) {
            window.open($topic_link, '_blank').focus();
            
            complete_activity($topic_id, $lesson_id);
        }
        
        else if ($topic_type == 'quiz') {
            UIkit.modal('#'+ $topic_link ).show();
        }
        //Open modal for other STORYLINE OR RISE
        else {
            $('.return-rise-button').removeClass("now-active");
            UIkit.modal('#modal-generic-topics').show();
            $('.cardet-content-here').html('<iframe class="iframe-' + $topic_type +'" src="' + $topic_link +'" style="width:100%;height:100%;"></iframe>');
            //storyline completion
            if ($topic_type == 'Storyline') {
                //Storyline completion
                $('.cardet-modal-spinner').css('opacity','1');
                storyline_load_completion($topic_id, $lesson_id);
            }
            //Storyline end
            
            //rise completion
            if ($topic_type == 'SCORM') {
                //rise completion
                $('.cardet-modal-spinner').css('opacity','1');
                rise_load_completion($topic_id, $lesson_id);
            }
            //rise end
        }
    })

    //Storyline completion
    function storyline_load_completion($topic_id, $lesson_id) {
          $(".iframe-Storyline").on("load", function(){
                $('.cardet-modal-spinner').css('opacity','0');
                $(".iframe-Storyline").css('opacity','1');
                //storyline Load
                $(this).contents().on("click","div[data-acc-text*='EXIT'], div[data-acc-text*='exit'], div[data-acc-text*='complete'], div[data-acc-text*='COMPLETE']", function(event){
                event.preventDefault();
                $(".iframe-Storyline").css('opacity','0');
                complete_activity($topic_id, $lesson_id);
                UIkit.modal('#modal-generic-topics').hide();
                $('.cardet-content-here').html('');
                })
            }) 
    }
    
    // RISE completion
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
                                //$(".iframe-Rise").css('opacity', '0');
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
    
    //Complete activity function
    function complete_activity($topic_id, $lesson_id) {
        $('.cardet-modal-spinner').css('opacity','1');
        $('.ajax_content').css('opacity','0');
        $.ajax(
            {
                type: "get",
                data: {
                    action: 'completeLD',
                    topic_id: $topic_id,
                    lesson_id: $lesson_id
                },
                dataType: "html",
                url: my_ajax_object.ajax_url,
                complete: function (msg) {
                    //UIkit.modal('#modal-generic-topics').hide();
                    //console.log(msg.responseText);
                    $('.ajax_content').html(msg.responseText);
                    //$('.cardet-content-here').html('');
                    $('.cardet-modal-spinner').css('opacity','0');
                    $('.ajax_content').css('opacity','1');
                    $('.return-rise-button').addClass("now-active"); 
                }
            });
    }    

    //Refresh topics when modal quiz is closed
    // Variable with element that fire event
    var $slideItem = $('.quiz-modals');

    $slideItem.on('hide', function(){
        $('.ajax_content').css('opacity','0');
        $('.cardet-modal-spinner').css('opacity','1');
        $.ajax(
            {
                type: "get",
                data: {
                    action: 'ajaxtopics',
                    lesson_id: $lesson_id
                },
                dataType: "html",
                url: my_ajax_object.ajax_url,
                complete: function (msg) {
                    //UIkit.modal('#modal-generic-topics').hide();
                    //console.log(msg.responseText);
                    $('.ajax_content').html(msg.responseText);
                    //$('.cardet-content-here').html('');
                    $('.cardet-modal-spinner').css('opacity','0');
                    $('.ajax_content').css('opacity','1');

                }
            });
    }); 

});
