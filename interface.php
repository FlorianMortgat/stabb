<?php

require('../config.php');

// pour le débuggage : affichage des erreurs + formatage du JSON
define('JSON_FLAGS', 0);
define('DEBUGGING', false);


$get  = $_GET['get'];
$post = $_POST['post'];

// Mute PHP to prevent any unwanted output (such as warnings from core methods) from polluting the JSON response.
// the only way out of this script should be the function `response()` which takes
// care of closing the output buffer.
// `response()` will also include the silenced content into the response (for analysis) if DEBUGGING is true.
ob_start();


/**
 * Note sur le nommage : les fonctions préfixées par _g_ ou _p_ ne retournent rien mais renvoient une réponse JSON :
 *     - _g_ = 'get' (lecture d’informations en base)
 *     - _p_ = 'post' (modifications en base : insert, delete, update…)
 */
if (!empty($get)) {
	switch ($get) {
		case 'level':
			if (!isset($_GET['level'])) failureResponse('Specify level (int)');
			$level = $_GET['level'];
			if (!preg_match('/\d+/', $level)) {
				failureResponse('Level must be numeric');
			}
			_g_level($level);
			break;
		default:
			__unhandled($get);
			break;
	}
} elseif (!empty($post)) {
	switch ($post) {
		default:
			__unhandled($post);
	}
}

function _g_level($levelNumber) {
	$filename = 'assets/levels/level' . $levelNumber . '.md';
	if (filesize($filename) > 1024*100) {
		failureResponse('The requested level file is suspiciously large (>100kB)');
	} 
	successResponse(array(file_get_contents($filename)));
}

function __unhandled($post) {
	failureResponse('Unhandled');
}

/**
 * Wraps the payload in a json structure, prints it out and exits.
 *
 * @param mixed $payload Whatever the client-side code asked for
 */
function successResponse($payload)
{
	response(
		array(
			//'error' => null,
			'payload' => $payload,
		)
	);
}

/**
 * Wraps the error message and debugging payload in a json structure,
 * prints it out and exits.
 *
 * @param string $errorMessage Denial details or error description
 * @param mixed $debugPayload Anything that might help with debugging
 */
function failureResponse($errorMessage, $debugPayload = null)
{
	response(
		array(
			'error' => $errorMessage,
			'debugging' => $debugPayload,
			//'payload' => null,
		)
	);
}

/**
 * Single way out for the interface: takes care of:
 *   - closing the output buffer
 *   - printing out the JSON-encoded content
 *   - embedding debugging information
 *   - exiting the script
 * @param array $outArray
 */
function response($outArray)
{
	header('Content-Type: text/json');
	if (DEBUGGING) {
		$outArray['__DEBUG'] = array(
			'output_buffer' => ob_get_clean()
		);
	} else {
		ob_end_clean();
	}

	echo json_encode($outArray, JSON_FLAGS);
	exit;
}
