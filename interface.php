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
			_g_level($db);
			break;
		default:
			__unhandled($get);
			break;
	}
} elseif (!empty($post)) {
	switch ($post) {
		case 'time-spent':
			_p_timeSpent($db);
			break;
		case 'delete-time-spent':
			_p_deleteTimeSpent($db);
			break;
		default:
			__unhandled($post);
	}
}


/**
 * Renvoie (ajax) une structure avec les projets du mois et les temps saisis par
 * l’utilisateur sur le mois.
 * @param $db
 */
function _g_monthData($db)
{
	global $user;
	$out = array();
	$year = intval(GETPOST('year', 'int'));
	$month = intval(GETPOST('month', 'int'));
	$out['projects'] = _getProjectsForUser($db, $user);
	$out['loggedTimes'] = _getLoggedTimesForMonth($db, $year, $month);
	successResponse($out);
}

/**
 * Renvoie (ajax) une structure avec les temps saisis par l'utilisateur sur la
 * journée (année mois jour passés par la requête HTTP)
 * @param $db
 */
function _g_dayData($db)
{
	global $user;
	$out = array();
	$year = intval(GETPOST('year', 'int'));
	$month = intval(GETPOST('month', 'int'));
	$day = intval(GETPOST('day', 'int'));
	$out['loggedTimes'] = _getLoggedTimesForDay($db, $year, $month, $day);
	successResponse($out);
}

/**
 * Returns an injection-safe quoted version of the string.
 * @param $db
 * @param $str
 * @return string
 */
function __quote($db, $str)
{
	return '"' . $db->escape($str) . '"';
}

/**
 * Wraps the payload in a json structure, prints it out and exits.
 *
 * @param array $payload Whatever the client-side code asked for
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
