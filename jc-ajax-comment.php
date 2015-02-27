<?php
/*
Plugin Name: JC Ajax Comment
Plugin URI:
Description: Posts comments and validates the comment form using Ajax
Author: Julio Cesar Llavilla CCama
Version: 1.00
Author URI:
*/

	add_action('wp_head','addImages');
	add_action('admin_enqueue_scripts','addImages');
	add_action( 'init', 'jc_scripts' );



function jc_scripts() {
	wp_enqueue_script('jquery-form');
	wp_enqueue_script( 'jcscripts', plugins_url( '/js/jc_comments.js', __FILE__ ),array( 'jquery' ) );
	wp_enqueue_style( 'style', plugins_url( '/css/jc_comments.css', __FILE__ ));
}
function addImages(){ ?>

<input id = "jc_url" type="hidden" value="<?php echo plugins_url( '/img/loading.gif', __FILE__ ); ?>">
<input id = "jc_url_close" type="hidden" value="<?php echo plugins_url( '/img/close.png', __FILE__ ); ?>">

<?php }