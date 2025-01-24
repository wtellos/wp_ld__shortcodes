<?php
// Limit countries from registration form - https://github.com/nlemoine/acf-country
    add_filter( 'acf/country/countries', function( $countries ) {
        // Filter to include only specified countries
        $filtered_countries = array_filter( $countries, function( $code ) {
            return in_array( $code, ['AL', 'AD', 'AM', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'GE', 'DE', 'GI', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MK', 'MT', 'MD', 'MC', 'ME', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'RU', 'SK', 'SI', 'ES', 'SE', 'CH', 'TR', 'UA', 'GB'], true );
        }, ARRAY_FILTER_USE_KEY);
    
        // Add "Please select" as the first option
        $filtered_countries = ['please_select' => __('Please select')] + $filtered_countries;
    
        // Add the "Other" option
        $filtered_countries['OTHER'] = __('Other');
    
        return $filtered_countries;
    });
