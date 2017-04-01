port module Grab exposing (..)

-- Port for copying text to the system clipboard
port grab : String -> Cmd msg
