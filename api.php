<?php
/* api.php - API for Function data
* 
* This file is part of the BlackOps3 Scripting API distribution (https://github.com/EHDSeven/BlackOps3-Scripting-API).
* Copyright (c) 2016 Michael "Seven" Larkin.
* 
* This program is free software: you can redistribute it and/or modify  
* it under the terms of the GNU General Public License as published by  
* the Free Software Foundation, version 3.
*
* This program is distributed in the hope that it will be useful, but 
* WITHOUT ANY WARRANTY; without even the implied warranty of 
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
* General Public License for more details.
*
* You should have received a copy of the GNU General Public License 
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
function openSql() {
    $con = mysqli_connect("localhost","username","password","blopsscript");
    if(!$con) {
        echo "Error: Unable to connect to MySQL." . PHP_EOL;
        echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
        echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
        exit;
    }
    return $con;
}
if(isset($_SERVER["PATH_INFO"])) {
    $url = explode("/",$_SERVER["PATH_INFO"]);
    $mode = strtolower($url[1]);

    if($mode=="get") {
        if(isset($url[2])) {
            header('Content-Type: application/json');
            $con = openSql();
            $job = strtolower($url[2]);

            switch($job) {
                case "functionlist":
                    if(isset($url[3])) {
                        $search = $con->real_escape_string($url[3]);
                        $result = $con->query("SELECT `functionName`, `return`, `entity`, `category`, `clientserver` FROM `functions` WHERE `functionName` like '%$search%';");

                        if (!$result) {
                            die('Invalid query: ' . $con->error);
                        }

                        while ($row = $result->fetch_object()){
                            $functionlist[] = $row;
                        }
                    } else {
                        $result = $con->query('SELECT `functionName`, `return`, `entity`, `category`, `clientserver` FROM `functions`');

                        if (!$result) {
                            die('Invalid query: ' . mysql_error());
                        }

                        while ($row = $result->fetch_object()) {
                            $functionlist[] = $row;
                        }
                    }
                break;

                case "function":
                    if(isset($url[3])) {
                        $search = $con->real_escape_string($url[3]);

                        $result = $con->query("SELECT * FROM `functions` WHERE `functionName` = '$search' LIMIT 1;");
                        if (!$result) {
                            die('Invalid query: ' . $con->error);
                        }

                        while ($row = $result->fetch_object()){
                            $functionlist[] = $row;
                        }
                    }
                break;

                case "return":
                    $result = $con->query("SELECT DISTINCT `return` FROM `functions`;");
                    if (!$result) {
                        die('Invalid query: ' . $con->error);
                    }

                    while ($row = $result->fetch_object()){
                        $functionlist[] = $row;
                    }
                break;

                case "entities":
                    $result = $con->query("SELECT DISTINCT `entity` FROM `functions`;");
                    if (!$result) {
                        die('Invalid query: ' . $con->error);
                    }

                    while ($row = $result->fetch_object()){
                        $functionlist[] = $row;
                    }
                break;

                case "categories":
                    $result = $con->query("SELECT DISTINCT `category` FROM `functions`;");
                    if (!$result) {
                        die('Invalid query: ' . $con->error);
                    }

                    while ($row = $result->fetch_object()){
                        $functionlist[] = $row;
                    }
                break;

                case "clientserver":
                    $result = $con->query("SELECT DISTINCT `clientserver` FROM `functions`;");
                    if (!$result) {
                        die('Invalid query: ' . $con->error);
                    }

                    while ($row = $result->fetch_object()){
                        $functionlist[] = $row;
                    }
                break;
            }


            if(isset($result)) {
                $result->close();
            }

            if(isset($functionlist)) {
                echo json_encode($functionlist);
            } else {
                echo "[{}]";
            }
            $con->close();
        }
    }
}
?>