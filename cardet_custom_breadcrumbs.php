<?php
//Custom Breadcrumbs shortcode

add_shortcode('cardet_custom_breadcrumbs','cardet_custom_breadcrumbs');
function cardet_custom_breadcrumbs(){
   ob_start();
   
   $site_url = get_site_url();
   $site_home_text = cardet_home_breadcrumbs_string();
    if ( 'sfwd-courses' == get_post_type()) {
    $course_title = get_the_title();
    echo "<ul class='uk-breadcrumb'><li> <a href='$site_url'>$site_home_text</a></li>
       
    <li><span class=cardet-span-text-breadcrumbs>$course_title</span></li></ul>";
 }
    else if ( 'sfwd-lessons' == get_post_type()) {
    $course_id = learndash_get_course_id();
    $course_title = get_the_title($course_id);
    $course_link = get_the_permalink($course_id);
    
    $lesson_title = get_the_title();
    
       echo "<a href='$site_url'>$site_home_text</a><span class='cardet-breadcrumbs-divider'>/</span><a href='$course_link'>$course_title</a><span class='cardet-breadcrumbs-divider'>/</span><span class=cardet-span-text-breadcrumbs>$lesson_title</span>";
    }
   
   return ob_get_clean();
}
