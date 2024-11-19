<?php 
function custom_password_reset_form() {

    ob_start();

    if (isset($_POST['cprf_reset_password'])) {
        $user_login = sanitize_text_field($_POST['cprf_user_login']);
        $user = get_user_by('login', $user_login);

        if (!$user && is_email($user_login)) {
            $user = get_user_by('email', $user_login);
        }

        $user_meta = get_user_meta($user->ID);

        if ($user) {

            add_filter('allow_password_reset', function($allow, $user_id) use ($user) {
              return $user->ID === $user_id ? true : $allow;
            }, 20, 2);
          
          $reset_key = get_password_reset_key($user);

          if (is_wp_error($reset_key)) {
              return;
          }

          $site_name = get_bloginfo('name');
          $site_url = home_url();
          $reset_url = network_site_url("wp-login.php?action=rp&key=$reset_key&login=" . rawurlencode($user->user_login) . "&wp_lang=en_US", 'login');

            $from_name = 'The ' . $site_name . ' Team';
            $from_email = 'wordpress@' . parse_url($site_url, PHP_URL_HOST);
          // Email headers
          $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . sanitize_text_field($from_name) . ' <' . sanitize_email($from_email) . '>',
        );

          $message = <<<EMAIL
                Hello {$user->display_name},
                <br><br>
                You request password reset to the "{$site_name}". <br><br>
                To reset your password click the link below or copy paste it in your browser.
                <br><br>
                {$reset_url}
                <br><br>
                If you did not request this, please ignore this email.
                <br><br>
                Best regards,
                <br>
                {$from_name}
                EMAIL;

                $subject = "Password reset request at {$site_name}";
          // Send the email
          if (wp_mail($user->user_email, $subject, $message, $headers)) {
              echo '<div class="uk-alert-success"><p>A password reset link has been sent to your email address.</p></div>';
          } else{
              echo '<div class="uk-alert-alert"><p>Email not sent! Please contact the system administrator!</p></div>';
          }
      } else {
          echo '<div class="uk-alert-danger"><p>No user found with this username or email.</p></div>';
      }
      
    }

    ?>
    <form method="post">
        <label class="" for="cprf_user_login">Username or Email:</label>
        <input class="uk-input uk-form-width-medium"  type="text" name="cprf_user_login" id="cprf_user_login" required><br><br>
        <input class="uk-button uk-button-primary" type="submit" name="cprf_reset_password" value="Send Reset Link">
    </form>
    <?php

    return ob_get_clean();
}
add_shortcode('password_reset_form', 'custom_password_reset_form');
