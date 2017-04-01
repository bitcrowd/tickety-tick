port module Ports exposing (..)

import Models exposing (Ticket)

-- Port for receiving tickets
port load : (List Ticket -> msg) -> Sub msg

-- Port for copying text to the system clipboard
port grab : String -> Cmd msg

-- Port for opening an external URL
port openext : String -> Cmd msg
